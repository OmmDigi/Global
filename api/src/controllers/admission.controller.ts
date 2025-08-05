import { pool } from "../config/db";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { doAdmission } from "../services/admission.service";
import { encrypt } from "../services/crypto";
import { verifyToken } from "../services/jwt";
import { createNewUser } from "../services/user.service";
import { IUserToken } from "../types";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorHandler } from "../utils/ErrorHandler";
import { getAuthToken } from "../utils/getAuthToken";
import { parsePagination } from "../utils/parsePagination";
import {
  VCreateAdmission,
  VGetSingleAdmission,
} from "../validator/admission.validator";

type IUserData = {
  userid: number | null;
  username: string | null;
  name: string | null;
  ph_no: string | null;
};

export const createAdmission = asyncErrorHandler(async (req, res) => {
  /*
      1) first need to check is the user is new user or existing user, (DONE)
      2) if new user admission then create a new user row in user table get back the user id, (DONE)
      3) if old user taking get some info about that user
      4) get current course_fee_structure
      5) create a new row in fillup_forms table,
      6) create a new row in enrolled_courses table,
      7) create a new row in admission_data table,
      8) send back the course_fee_structure to the client for payment details showing page
    */

  const { error, value } = VCreateAdmission.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const client = await pool.connect();

  const userData: IUserData = {
    userid: null,
    name: null,
    ph_no: null,
    username: null,
  };

  try {
    await client.query("BEGIN");

    // check is the user is new user or existing user
    const token = getAuthToken(req);
    if (token !== null) {
      // if token is not null and it's a valid token than he is not a new user. token is not valid throw error
      const { error, data } = await verifyToken<IUserToken>(token);
      if (error) {
        throw new ErrorHandler(401, "Unauthorized");
      }

      // fetch the user info from database
      const { rows, rowCount } = await pool.query(
        "SELECT id, name, username, ph_no FROM users WHERE id = $1",
        [data?.id]
      );

      if (rowCount === 0) {
        throw new ErrorHandler(404, "No user found for the admission");
      }
      userData.userid = rows[0].id;
      userData.name = rows[0].name;
      userData.username = rows[0].username;
      userData.ph_no = rows[0].ph_no;
    }

    // if new user create a new table in user table
    if (!userData.userid) {
      // parse the admission data to get some other user info
      if (!value.admission_data)
        throw new ErrorHandler(400, "Admission data is required");
      const admission_data = JSON.parse(value.admission_data ?? "{}");
      const studentName = admission_data?.candidateName;
      const studentPhNumber = admission_data?.phone;
      const userName = admission_data?.username;
      const password = admission_data?.password;
      const profileImage = admission_data?.image;

      if (!password)
        throw new ErrorHandler(400, "Account password is required", [
          "password",
        ]);
      if (!userName)
        throw new ErrorHandler(400, "Username is required", ["username"]);
      if (!studentPhNumber)
        throw new ErrorHandler(400, "Phone Number is required", ["phone"]);
      if (!studentName)
        throw new ErrorHandler(400, "Student Name is required", ["name"]);

      const encodedPassword = encrypt(password);
      const { id, name, ph_no, username } = await createNewUser({
        category: "Student",
        email: "",
        ph_no: studentPhNumber,
        name: studentName,
        designation: "Student",
        username: userName,
        image: profileImage,
        password: encodedPassword,
        client,
      });

      userData.userid = id;
      userData.name = name;
      userData.ph_no = ph_no;
      userData.username = username;
    }

    // get the coures info with course_fee_structure
    const { rows, rowCount } = await client.query(
      `
      SELECT 
        c.*,
        COALESCE(
            (
                SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'fee_head_id', cfs.fee_head_id,
                        'fee_head_name', cfh.name,
                        'amount', cfs.amount,
                        'min_amount', cfs.min_amount,
                        'required', cfs.required
                    )
                    ORDER BY cfs.id
                )
                FROM course_fee_structure cfs
                LEFT JOIN course_fee_head cfh ON cfs.fee_head_id = cfh.id
                  WHERE cfs.course_id = c.id
              ),
              '[]'::json
          ) AS fee_structures
      FROM course c
      WHERE c.id = $1
      GROUP BY c.id;
       `,
      [value.course_id]
    );
    if (rowCount === 0) throw new ErrorHandler(404, "No course found");

    const fee_structure = rows[0].fee_structures;

    // do the admission
    const { form_id } = await doAdmission({
      student_id: userData.userid,
      client,
      admission_data: value.admission_data,
      course_id: value.course_id,
      batch_id: value.batch_id,
      fee_structure,
      session_id: value.session_id,
    });

    await client.query("COMMIT");

    res.status(201).json(
      new ApiResponse(
        201,
        "Admission info successfully saved",
        {
          form_id,
          fee_structure,
        }
        // data.instrumentResponse.redirectInfo.url
      )
    );
  } catch (error: any) {
    await client.query("ROLLBACK");
    throw new ErrorHandler(400, error.message);
  } finally {
    client.release();
  }
});

export const getAdmissionList = asyncErrorHandler(async (req, res) => {
  const { TO_STRING } = parsePagination(req);
  const { rows } = await pool.query(
    `
    SELECT
      ff.id AS form_id,
      ff.form_name,
      u.name AS student_name,
      u.image AS student_image,
      c.name AS course_name,
      (SELECT SUM(amount) FROM form_fee_structure WHERE form_id = ff.id) AS course_fee,
      COALESCE((SELECT SUM(amount) FROM form_fee_structure WHERE form_id = ff.id), 0.00) - COALESCE((SELECT SUM(amount) FROM payments WHERE form_id = ff.id), 0.00) AS due_amount,
      b.month_name AS batch_name
      -- JSON_AGG(JSON_BUILD_OBJECT('batch_id', b.id, 'batch_name', b.month_name)) AS batches
    FROM fillup_forms ff

    LEFT JOIN users u
    ON u.id = ff.student_id

    LEFT JOIN enrolled_courses ec
    ON ec.form_id = ff.id

    LEFT JOIN batch b
    ON b.id = ec.batch_id

    LEFT JOIN course c
    ON c.id = ec.course_id

    GROUP BY ff.id, u.id, c.id, b.id
    ORDER BY ff.id DESC
    ${TO_STRING}
    `
  );
  res.status(200).json(new ApiResponse(200, "Admission List", rows));
});

export const getSingleAdmission = asyncErrorHandler(async (req, res) => {
  const { error, value } = VGetSingleAdmission.validate(req.params ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const form_id = value.form_id;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows: basicInfo } = await client.query(
      `
       SELECT
          ff.id AS form_id,
          ff.form_name,
          u.name AS student_name,
          u.image AS student_image,
          c.name AS course_name,
          b.month_name AS batch_name,
          s.name AS session_name,
          COALESCE((SELECT SUM(amount) FROM form_fee_structure WHERE form_id = ff.id), 0.00) AS course_fee,
          COALESCE((SELECT SUM(amount) FROM form_fee_structure WHERE form_id = ff.id), 0.00) - COALESCE((SELECT SUM(amount) FROM payments WHERE form_id = ff.id), 0.00) AS due_amount
        FROM fillup_forms ff

        LEFT JOIN users u
        ON u.id = ff.student_id

        LEFT JOIN enrolled_courses ec
        ON ec.form_id = $1

        LEFT JOIN course c
        ON c.id = ec.course_id

        LEFT JOIN batch b
        ON b.id = ec.batch_id

        LEFT JOIN session s
        ON s.id = ec.session_id

        WHERE ff.id = $1
      `,
      [form_id]
    );
    const { rows : feeStructureInfo} = await client.query(
      `
        SELECT
          cfh.name AS fee_head_name,
          cfh.id AS fee_head_id,
          COALESCE(ffs.amount, 0.00) AS price,
          COALESCE(ffs.amount, 0.00) - COALESCE(SUM(p.amount), 0.00) AS due_amount
        FROM form_fee_structure ffs

        LEFT JOIN course_fee_head cfh
        ON cfh.id = ffs.fee_head_id

        LEFT JOIN payments p
        ON p.form_id = $1 AND cfh.id = p.fee_head_id

        WHERE ffs.form_id = $1

        GROUP BY cfh.id, ffs.id
      `,
      [form_id]
    );
    const { rows : admissionFormPayments } = await client.query(
      `
        SELECT
          cfh.name AS fee_head_name,
          p.*
        FROM payments p

        LEFT JOIN course_fee_head cfh
        ON cfh.id = p.fee_head_id

        WHERE p.form_id = $1
      `,
      [form_id]
    );
    await client.query("COMMIT");

    res.status(200).json(new ApiResponse(200, "Fee Info", {
      ... basicInfo[0],
      fee_structure_info : feeStructureInfo,
      payments_history : admissionFormPayments
    }))
  } catch (error) {
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
});