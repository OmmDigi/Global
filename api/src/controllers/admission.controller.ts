import { pool } from "../config/db";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import {
  doAdmission,
  getAdmissions,
  getSingleAdmissionData,
} from "../services/admission.service";
import { encrypt } from "../services/crypto";
import { verifyToken } from "../services/jwt";
import { createNewUser } from "../services/user.service";
import { CustomRequest, IUserToken } from "../types";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorHandler } from "../utils/ErrorHandler";
import { generatePlaceholders } from "../utils/generatePlaceholders";
import { getAuthToken } from "../utils/getAuthToken";
import { parsePagination } from "../utils/parsePagination";
import {
  VCreateAdmission,
  VGetSessionCourseHeadPrice,
  VGetSingleAdmission,
  VGetSingleAdmissionForm,
  VModifyAdmissionFeeHead,
  VUpdateAdmission,
  VUpdateAdmissionStatus,
  VUpdateDeclarationStatus,
  VUpdateSessionCourseHeadPrice,
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
        "SELECT id, name, username, ph_no FROM users WHERE id = $1 AND category = 'Student'",
        [data?.id]
      );

      if (rowCount !== 0) {
        userData.userid = rows[0].id;
        userData.name = rows[0].name;
        userData.username = rows[0].username;
        userData.ph_no = rows[0].ph_no;
      }

      // throw new ErrorHandler(404, "No user found for the admission");
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
      const email = admission_data?.email;

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
        email: email,
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

    const fee_structure = rows[0].fee_structures as {
      fee_head_id: number;
      fee_head_name: string;
      amount: number;
      min_amount: number;
      required: boolean;
    }[];

    // do the admission
    const { form_id } = await doAdmission({
      student_id: userData.userid,
      client,
      admission_data: value.admission_data,
      course_id: value.course_id,
      batch_id: value.batch_id,
      fee_structure,
      session_id: value.session_id,
      declaration_status: value?.declaration_status,
    });

    await client.query("COMMIT");

    res.status(201).json(
      new ApiResponse(201, "Admission info successfully saved", {
        form_id,
        course_name: rows[0].name,
        fee_structure: fee_structure.filter(
          (item) => item.fee_head_id == 1 || item.fee_head_id == 3
        ),
      })
    );
  } catch (error: any) {
    await client.query("ROLLBACK");
    throw new ErrorHandler(400, error.message);
  } finally {
    client.release();
  }
});

export const updateAdmissionData = asyncErrorHandler(async (req, res) => {
  const { error, value } = VUpdateAdmission.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const admission_data = JSON.parse(value.admission_data ?? "{}");
  const studentName = admission_data?.candidateName;
  const studentPhNumber = admission_data?.phone;
  const userName = admission_data?.username;
  const password = admission_data?.password;
  const profileImage = admission_data?.image;
  const email = admission_data?.email;

  if (!password)
    throw new ErrorHandler(400, "Account password is required", ["password"]);
  if (!userName)
    throw new ErrorHandler(400, "Username is required", ["username"]);
  if (!studentPhNumber)
    throw new ErrorHandler(400, "Phone Number is required", ["phone"]);
  if (!studentName)
    throw new ErrorHandler(400, "Student Name is required", ["name"]);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows: formTableInfo, rowCount } = await client.query(
      "SELECT student_id FROM fillup_forms WHERE id = $1",
      [value.form_id]
    );
    if (rowCount === 0) throw new ErrorHandler(404, "No form found");

    const studentId = formTableInfo[0].student_id;
    const encodedPassword = encrypt(password);

    // update the student basic info accoding to the form
    await client.query(
      "UPDATE users SET username = $1, password = $2, name = $3, ph_no = $4, image = $5, email = $6 WHERE id = $7",
      [
        userName,
        encodedPassword,
        studentName,
        studentPhNumber,
        profileImage,
        email,
        studentId,
      ]
    );

    // update the admission form in admission_data table if exist update else insert
    await client.query(
      `
       INSERT INTO admission_data 
        (form_id, student_id, admission_details) 
       VALUES 
         ($1, $2, $3)
       ON CONFLICT (form_id, student_id) DO UPDATE
         SET admission_details = EXCLUDED.admission_details
      `,
      [value.form_id, studentId, value.admission_data]
    );

    await client.query("COMMIT");

    res.status(200).json(new ApiResponse(200, "Admission form updated"));
  } catch (e: any) {
    await client.query("ROLLBACK");
    throw new ErrorHandler(400, e.message);
  } finally {
    client.release();
  }
});

export const getAdmissionList = asyncErrorHandler(async (req, res) => {
  const { rows } = await getAdmissions(req);
  res.status(200).json(new ApiResponse(200, "Admission Search List", rows));
});

export const updateAdmissionStatus = asyncErrorHandler(async (req, res) => {
  const { error, value } = VUpdateAdmissionStatus.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const status_number = value.form_status == true ? 2 : 3;
  const status_text = value.form_status == true ? "Approve" : "Cancel";

  await pool.query("UPDATE fillup_forms SET status = $1 WHERE id = $2", [
    status_number,
    value.form_id,
  ]);

  res.status(200).json(new ApiResponse(200, `Admission ${status_text}`));
});

export const getSingleAdmission = asyncErrorHandler(
  async (req: CustomRequest, res) => {
    const { error, value } = VGetSingleAdmission.validate(req.params ?? {});
    if (error) throw new ErrorHandler(400, error.message);

    const response = await getSingleAdmissionData(
      value.form_id,
      undefined,
      req.user_info?.id
    );

    res.status(200).json(new ApiResponse(200, "Fee Info", response));
  }
);

export const getSingleAdmissionFormData = asyncErrorHandler(
  async (req, res) => {
    const { error, value } = VGetSingleAdmissionForm.validate(req.params ?? {});
    if (error) throw new ErrorHandler(400, error.message);

    const { rows, rowCount } = await pool.query(
      `
    SELECT
      ff.id AS form_id,
      ff.student_id,
      (
        SELECT admission_details FROM admission_data 
        WHERE student_id = ff.student_id
        ORDER BY id DESC
        LIMIT 1
      ) as admission_details
    FROM fillup_forms ff
    WHERE ff.id = $1
    `,
      [value.form_id]
    );

    if (rowCount === 0) throw new ErrorHandler(400, "No Form Data Found");

    res.status(200).json(new ApiResponse(200, "Admision Details", rows[0]));
  }
);

export const acceptDeclarationStatus = asyncErrorHandler(
  async (req: CustomRequest, res) => {
    const { error, value } = VUpdateDeclarationStatus.validate(req.body ?? {});
    if (error) throw new ErrorHandler(400, error.message);

    const userId = req.user_info?.id;

    const { rowCount } = await pool.query(
      "UPDATE fillup_forms SET declaration_status = 1 WHERE id = $1 AND student_id = $2 RETURNING student_id",
      [value.form_id, userId]
    );
    if (rowCount === 0) {
      throw new ErrorHandler(404, "Failed to accept declaration");
    }

    res.status(200).json(new ApiResponse(200, "Declaration status accepted"));
  }
);

export const downloadDeclarationStatus = asyncErrorHandler(async (req, res) => {
  // const buffer = new DeclarationFormGenerator();
  // buffer.generateDeclarationForm({
  //   address : "Something"
  // })
});

export const getAdmissionFeeHeadPrice = asyncErrorHandler(async (req, res) => {
  const { error, value } = VGetSessionCourseHeadPrice.validate(req.query ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  let filter = "";
  let placeholder = 1;
  const filterValues: string[] = [];

  if (value.course_id) {
    if (filter === "") {
      filter = `WHERE ec.course_id = $${placeholder++}`;
    } else {
      filter += ` AND ec.course_id = $${placeholder++}`;
    }

    filterValues.push(value.course_id);
  }

  if (value.batch_id) {
    if (filter === "") {
      filter = `WHERE ec.batch_id = $${placeholder++}`;
    } else {
      filter += ` AND ec.batch_id = $${placeholder++}`;
    }

    filterValues.push(value.batch_id);
  }

  if (value.fee_head_id) {
    if (filter === "") {
      filter = `WHERE ffs.fee_head_id = $${placeholder++}`;
    } else {
      filter += ` AND ffs.fee_head_id = $${placeholder++}`;
    }

    filterValues.push(value.fee_head_id);
  }

  if (value.session_id) {
    if (filter === "") {
      filter = `WHERE ec.session_id = $${placeholder++}`;
    } else {
      filter += ` AND ec.session_id = $${placeholder++}`;
    }

    filterValues.push(value.session_id);
  }

  const { rows, rowCount } = await pool.query(
    `
    SELECT
      ffs.amount
    FROM enrolled_courses ec

    LEFT JOIN form_fee_structure ffs
    ON ffs.form_id = ec.form_id

    ${filter}

    LIMIT 1
    `,
    filterValues
  );

  if (rowCount === 0) {
    return res.status(200).json(new ApiResponse(200, "Form Amount", "0"));
  }

  res.status(200).json(new ApiResponse(200, "Form Amount", rows[0].amount));
});

export const updateAdmissionFeeHeadAmount = asyncErrorHandler(
  async (req, res) => {
    const { error, value } = VUpdateSessionCourseHeadPrice.validate(
      req.body ?? {}
    );
    if (error) throw new ErrorHandler(400, error.message);
    
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        "INSERT INTO admission_fee_head_amount_history (session_id, fee_head_id, previous_amount, current_amount, course_id, batch_id) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          value.session_id,
          value.fee_head_id,
          value.previous_amount,
          value.current_amount,
          value.course_id,
          value.batch_id ?? null,
        ]
      );

      //get the list of form id which should be update
      let filter = "";
      let placeholderNum = 1;
      const filterValues: string[] = [];

      if (value.course_id) {
        if (filter === "") {
          filter = `WHERE ec.course_id = $${placeholderNum++}`;
        } else {
          filter += ` AND ec.course_id = $${placeholderNum++}`;
        }

        filterValues.push(value.course_id);
      }

      if (value.batch_id) {
        if (filter === "") {
          filter = `WHERE ec.batch_id = $${placeholderNum++}`;
        } else {
          filter += ` AND ec.batch_id = $${placeholderNum++}`;
        }

        filterValues.push(value.batch_id);
      }

      if (value.session_id) {
        if (filter === "") {
          filter = `WHERE ec.session_id = $${placeholderNum++}`;
        } else {
          filter += ` AND ec.session_id = $${placeholderNum++}`;
        }

        filterValues.push(value.session_id);
      }

      const { rows } = await client.query(
        `
        SELECT 
         ec.form_id
        FROM enrolled_courses ec
        ${filter}
        `,
        filterValues
      );

      const placeholder = generatePlaceholders(rows.length, 5);

      await client.query(
        `
        INSERT INTO form_fee_structure 
          (form_id, fee_head_id, amount, min_amount, required)
        VALUES
          ${placeholder}
        ON CONFLICT (form_id, fee_head_id) DO UPDATE 
          SET amount = EXCLUDED.amount
        `,
        rows.flatMap((row: any) => [
          row.form_id,
          value.fee_head_id,
          value.current_amount,
          value.current_amount,
          true,
        ])
      );
      await client.query("COMMIT");

      res
        .status(201)
        .json(
          new ApiResponse(
            200,
            "Admission Fee Head Amount Successfully Update For This Session"
          )
        );
    } catch (error: any) {
      await client.query("ROLLBACK");
      throw new ErrorHandler(400, error.message);
    } finally {
      client.release();
    }
  }
);

export const getAdmissionFeeHeadHistoryList = asyncErrorHandler(
  async (req, res) => {
    const { TO_STRING } = parsePagination(req);

    let filter = "";
    let placeholder = 1;
    const filterValues: string[] = [];

    if (req.query.fee_head_id) {
      if (filter === "") {
        filter = `WHERE afhah.fee_head_id = $${placeholder++}`;
      } else {
        filter += ` AND afhah.fee_head_id = $${placeholder++}`;
      }
      filterValues.push(req.query.fee_head_id.toString());
    }

    const { rows } = await pool.query(
      `
     SELECT
      cfh.name AS fee_head_name,
      s.name AS session_name,
      afhah.previous_amount,
      afhah.current_amount,
      TO_CHAR(afhah.created_at, 'FMDD FMMonth, YYYY') AS created_at,
      b.month_name AS batch_name,
      c.name AS course_name
     FROM admission_fee_head_amount_history afhah

     LEFT JOIN course_fee_head cfh
     ON cfh.id = afhah.fee_head_id

     LEFT JOIN session s
     ON s.id = afhah.session_id

     LEFT JOIN course c
     ON c.id = afhah.course_id

     LEFT JOIN batch b
     ON b.id = afhah.batch_id

     ${filter}

     ORDER BY created_at DESC

     ${TO_STRING}
    `,
      filterValues
    );

    res
      .status(200)
      .json(new ApiResponse(200, "Admission amount history", rows));
  }
);

export const modifyFeeHeadOfAdmission = asyncErrorHandler(async (req, res) => {
  const { error, value } = VModifyAdmissionFeeHead.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  await pool.query(
    `
    INSERT INTO form_fee_structure 
      (form_id, fee_head_id, amount, min_amount, required)
    VALUES
      ($1, $2, $3, $4, $5)
    ON CONFLICT (form_id, fee_head_id) DO UPDATE 
      SET amount = EXCLUDED.amount
    `,
    [value.form_id, value.fee_head_id, value.amount, value.amount, false]
  );

  res
    .status(200)
    .json(new ApiResponse(200, "Admission Fee Head Successfully Modified"));
});
