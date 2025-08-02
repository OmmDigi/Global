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
import { VCreateAdmission } from "../validator/admission.validator";

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
     
      if(!password) throw new ErrorHandler(400, "Account password is required", ["password"])
      if(!userName) throw new ErrorHandler(400, "Username is required", ["username"])
      if(!studentPhNumber) throw new ErrorHandler(400, "Phone Number is required", ["phone"])
      if(!studentName) throw new ErrorHandler(400, "Student Name is required", ["name"])

      const encodedPassword = encrypt(password);
      const { id, name, ph_no, username } = await createNewUser({
        category: "Student",
        email: "",
        ph_no: studentPhNumber,
        name: studentName,
        designation: "Student",
        username: userName,
        image : profileImage,
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
      `SELECT 
        c.*,
        COALESCE(JSON_AGG(JSON_BUILD_OBJECT('fee_head_id', cfs.fee_head_id, 'fee_head_name', cfh.name, 'amount', cfs.amount)) FILTER (WHERE cfs.id IS NOT NULL), '[]') AS fee_structures
       FROM course c

       LEFT JOIN course_fee_structure cfs
       ON cfs.course_id = c.id

       LEFT JOIN course_fee_head cfh
       ON cfs.fee_head_id = cfh.id

       WHERE c.id = $1
       GROUP BY c.id
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
