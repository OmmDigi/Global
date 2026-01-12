import { pool } from "../config/db";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { decrypt, encrypt } from "../services/crypto";
import { createToken } from "../services/jwt";
import { verifyUser } from "../services/user.service";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorHandler } from "../utils/ErrorHandler";
import { parsePagination } from "../utils/parsePagination";
import {
  enquiryUpdateValidator,
  VAddEnquiry,
  VAddLoanOrAdvancePayment,
  VChangePassword,
  VCreateUser,
  VGeneratePayslip,
  VGetPayslip,
  VGetPayslipList,
  VGetUserList,
  VLoginUser,
  VSingleLoan,
  VSingleUser,
  VUpdateLoanOrAdvancePayment,
  VUpdateTeacherClassStatus,
  VUpdateUser,
} from "../validator/users.validator";
import { CustomRequest, TeacherFeeStruct } from "../types";
import {
  getAdmissions,
  getSingleAdmissionData,
} from "../services/admission.service";
import { VGetSingleAdmission } from "../validator/admission.validator";
import { getLeaveList } from "../services/leave.service";
import { generatePlaceholders } from "../utils/generatePlaceholders";
import { manageTeacherClassStatus } from "../services/attendance.service";
import { essl } from "../config/essl";
import QueryStream from "pg-query-stream";
import { generateTeacherPayslipQuery } from "../utils/generateTeacherPayslipQuery";
import { numberToWords } from "../utils/numberToWords";
import { sendEmail } from "../utils/sendEmail";
import { doTransition } from "../utils/doTransition";

export const doEnquiry = asyncErrorHandler(async (req, res) => {
  const { error, value } = VAddEnquiry.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  await doTransition(async (client) => {
    const { rows } = await client.query(
      "INSERT INTO enquiry (name, email, phone, message, address, age, gender, education_qualification) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
      [
        value.name,
        value.email ?? null,
        value.phone,
        value.message ?? null,
        value.address,
        value.age,
        value.gender,
        value.education_qualification,
      ]
    );

    const placeholders = generatePlaceholders(value.course_ids.length, 2);
    await client.query(
      `INSERT INTO enquiry_courses (enquiry_id, course_id) VALUES ${placeholders}`,
      value.course_ids.flatMap((id: any) => [rows[0].id, id])
    );
  });

  const emails = process.env.ENQUIRY_EMAIL?.split(",") ?? [];

  if (emails.length != 0) {
    await sendEmail(emails, "ENQUIRY_EMAIL", {
      name: value.name,
      email: value?.email,
      phone: value.phone,
      course: undefined,
      message: value?.message,
    });
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Enquiry successfully submitted. We will get back to you soon"
      )
    );
});

export const getAllEnquiry = asyncErrorHandler(async (req, res) => {
  const { TO_STRING } = parsePagination(req);

  let filter = "WHERE 1=1";
  const filterValue: any[] = [];
  let placeholderNum = 1;

  if (req.query.status) {
    filter += ` AND e.status = $${placeholderNum++}`;
    filterValue.push(req.query.status);
  }

  if (req.query.from_date && req.query.to_date) {
    filter += ` AND e.created_at::date >= $${placeholderNum++}::date AND e.created_at::date <= $${placeholderNum++}::date`;
    filterValue.push(req.query.from_date, req.query.to_date);
  }

  const enquiry = await pool.query(
    `SELECT 
      e.*,
      TO_CHAR(e.created_at, 'FMDD FMMonth, YYYY') AS created_at,
      STRING_AGG(c.name, ', ') AS course_names
     FROM enquiry e

     LEFT JOIN enquiry_courses ec
     ON e.id = ec.enquiry_id

     LEFT JOIN course c
     ON ec.course_id = c.id

     ${filter} 

     GROUP BY e.id

     ORDER BY e.created_at DESC

     ${TO_STRING}
     `,
    filterValue
  );

  res
    .status(200)
    .json(new ApiResponse(200, "Enquiry fetched successfully", enquiry.rows));
});

export const updateEnquiryStatus = asyncErrorHandler(async (req, res) => {
  const { error, value } = enquiryUpdateValidator.validate(req.body);
  if (error) {
    throw new ErrorHandler(400, error.message);
  }

  await pool.query("UPDATE enquiry SET status = $1 WHERE id = $2", [
    value.status,
    value.id,
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, "Enquiry status updated successfully", null));
});

export const getChangePasswordPage = asyncErrorHandler(async (req, res) => {
  res.render("reset-password", {
    frontend_url: process.env.FRONTEND_HOST_URL,
  });
});

export const changePassword = asyncErrorHandler(
  async (req: CustomRequest, res) => {
    const { error, value } = VChangePassword.validate(req.body ?? {});
    if (error) throw new ErrorHandler(400, error.message);

    // if (!req.user_info?.id) {
    //   throw new ErrorHandler(401, "Please login first");
    // }

    const { id } = await verifyUser({
      password: value.password,
      username: value.username,
    });

    const encrypt_pass = encrypt(value.new_password);

    const { rowCount } = await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2 AND category != 'Admin' RETURNING id",
      [encrypt_pass, id]
    );
    if (rowCount === 0)
      throw new ErrorHandler(400, "Unable to find your account");

    res.status(200).json(new ApiResponse(200, "Password successfully changed"));
  }
);

export const loginUser = asyncErrorHandler(async (req, res) => {
  const { error, value } = VLoginUser.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  // const { rows, rowCount } = await pool.query(
  //   "SELECT id, password, category FROM users WHERE username = $1 AND category = $2",
  //   [value.username, value.category]
  // );

  // if (rowCount === 0)
  //   throw new ErrorHandler(404, "Unable to find your account", ["username"]);

  // const { isError, decrypted } = decrypt(rows[0].password);
  // if (isError || decrypted !== value.password)
  //   throw new ErrorHandler(400, "Wrong Password", ["password"]);

  const { category, id, permissions, name } = await verifyUser({
    password: value.password,
    username: value.username,
  });

  const permissionArray = JSON.parse(permissions ?? "[]");

  const token = createToken({
    id,
    category,
    permissions,
  });

  //set the http only cookie
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
    domain: process.env.DOMAIN,
  });

  res.status(200).json(
    new ApiResponse(200, "Login Successfull", {
      category,
      id,
      token,
      permissions: permissionArray,
      name,
    })
  );
});

export const createUser = asyncErrorHandler(async (req, res) => {
  const { error, value } = VCreateUser.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const encrypt_pass = encrypt(value.password);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const permissionsString = JSON.stringify(value.permissions);

    const { rowCount, rows } = await client.query(
      `
        INSERT INTO users 
          (category, name, email, ph_no, joining_date, designation, description, image, username, password, permissions) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (username) DO NOTHING
        RETURNING id
     `,
      [
        value.category,
        value.name,
        value.email,
        value.ph_no,
        value.joining_date,
        value.designation,
        value.description,
        value.image,
        value.email,
        encrypt_pass,
        permissionsString,
      ]
    );

    if (rowCount === 0)
      throw new ErrorHandler(400, "User email already exists", ["email"]);

    const userID = rows[0].id.toString();
    const userCategory = value.category as "Teacher" | "Stuff";

    // customize the fee structure as needed
    if (userCategory === "Teacher") {
      const valueToStore: {
        course_id: number | null;
        amount: number;
        salary_type: string;
        class_per_month: number | null;
      }[] = [];

      value.fee_structure_teacher.forEach((item: TeacherFeeStruct) => {
        valueToStore.push({
          course_id: item.course_id,
          salary_type: item.type,
          amount: item.amount,
          class_per_month: item.class_per_month,
        });
        valueToStore.push({
          course_id: item.course_id,
          salary_type: "workshop",
          amount: item.workshop ?? 0.0,
          class_per_month: null,
        });
        valueToStore.push({
          course_id: item.course_id,
          salary_type: "extra",
          amount: item.extra ?? 0.0,
          class_per_month: null,
        });
      });

      if (value.p_tax) {
        valueToStore.push({
          amount: value.p_tax,
          class_per_month: null,
          course_id: null,
          salary_type: "P_tax",
        });
      }

      await client.query(
        `
        INSERT INTO employee_salary_structure 
          (employee_id, course_id, salary_type, amount, class_per_month)
        VALUES
          ${generatePlaceholders(valueToStore.length, 5)}
      `,
        valueToStore.flatMap((item) => [
          userID,
          item.course_id,
          item.salary_type,
          item.amount,
          item.class_per_month,
        ])
      );
    } else if (userCategory === "Stuff") {
      await client.query(
        `
        INSERT INTO employee_salary_structure 
          (employee_id, course_id, salary_type, amount, amount_type)
        VALUES
          ${generatePlaceholders(value.fee_structure_stuff.length, 5)}
      `,
        value.fee_structure_stuff.flatMap((item: any) => [
          userID,
          null,
          item.fee_head,
          item.amount,
          item.amount_type,
        ])
      );
    }

    // store data to the essl device
    await essl.setUser({
      name: value.name,
      password: value.password,
      uid: userID,
      userid: userID,
    });

    res
      .status(201)
      .json(new ApiResponse(201, "New user has successfully created", rows[0]));

    await client.query("COMMIT");
  } catch (e: any) {
    await client.query("ROLLBACK");
    throw new ErrorHandler(400, e.message);
  } finally {
    client.release();
  }
});

export const getOneUser = asyncErrorHandler(async (req, res) => {
  const { error, value } = VSingleUser.validate(req.params ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const user_id = value.id;

  const { rows, rowCount } = await pool.query(
    `
    SELECT 
      *,
      0 AS p_tax,
      TO_CHAR(joining_date, 'YYYY-MM-DD') AS joining_date,
      TO_CHAR(joining_date, 'FMDD FMMonth, YYYY') AS formatted_joining_date
    FROM users WHERE id = $1
    `,
    [user_id]
  );
  if (rowCount === 0) throw new ErrorHandler(404, "No user found");

  const userCategory = rows[0].category as "Teacher" | "Stuff";

  if (userCategory === "Teacher") {
    const { rows: feeStructrueTeacher } = await pool.query(
      `
        SELECT 
          course_id,
          MAX(CASE WHEN salary_type IN ('fixed', 'per_class', 'P_tax') THEN salary_type END) AS type,
          MAX(CASE WHEN salary_type IN ('fixed', 'per_class', 'P_tax') THEN amount END) AS amount,
          MAX(amount) FILTER (WHERE salary_type = 'workshop') AS workshop,
          MAX(amount) FILTER (WHERE salary_type = 'extra') AS extra,
          MAX(class_per_month) AS class_per_month
        FROM employee_salary_structure
        WHERE employee_id = $1
        GROUP BY course_id
        ORDER BY course_id;
    `,
      [user_id]
    );

    rows[0].fee_structure_teacher = feeStructrueTeacher.filter(
      (item: any) => item.type != "P_tax"
    );
    rows[0].p_tax =
      feeStructrueTeacher.find((item: any) => item.type == "P_tax")?.amount ??
      0;
    rows[0].fee_structure_stuff = [];
  } else {
    const { rows: feeStructrueStaff } = await pool.query(
      `
      SELECT 
        salary_type AS fee_head,
        amount_type,
        amount
      FROM employee_salary_structure
      WHERE employee_id = $1   -- change employee id here
        AND course_id IS NULL
      ORDER BY salary_type;
    `,
      [user_id]
    );

    rows[0].fee_structure_teacher = [];
    rows[0].fee_structure_stuff = feeStructrueStaff;
  }

  if (rowCount === 0) throw new ErrorHandler(404, "User Not Found");

  const { decrypted } = decrypt(rows[0].password);
  rows[0].password = decrypted;
  rows[0].permissions = JSON.parse(rows[0].permissions ?? "[]");

  res.status(200).json(new ApiResponse(200, "Single User Info", rows[0]));
});

export const getUsersList = asyncErrorHandler(async (req, res) => {
  const { error, value } = VGetUserList.validate(req.query ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  let filter = "WHERE category != 'Admin' AND category != 'Student'";
  const filterValues: string[] = [];
  let placeholdernum = 1;

  if (value.category) {
    filter += ` AND category = $${placeholdernum++}`;
    filterValues.push(value.category);
  }

  const { LIMIT, OFFSET } = parsePagination(req);

  const ALLOWED_FIELDS = new Map<string, boolean>();
  ALLOWED_FIELDS.set("id", true);
  ALLOWED_FIELDS.set("name", true);
  ALLOWED_FIELDS.set("email", true);
  ALLOWED_FIELDS.set("category", true);
  ALLOWED_FIELDS.set("ph_no", true);
  ALLOWED_FIELDS.set("joining_date", true);
  ALLOWED_FIELDS.set("designation", true);
  ALLOWED_FIELDS.set("description", true);
  ALLOWED_FIELDS.set("image", true);

  let columns =
    "id, name, email, category, ph_no, joining_date, designation, description, image";
  if (value.fields) {
    const splitedFields = value.fields.split(",") as string[];
    //security checks
    for (const field of splitedFields) {
      if (!ALLOWED_FIELDS.has(field))
        throw new ErrorHandler(400, `${field} Is Not Allowed`);
    }
    columns = value.fields;
  }

  const { rows } = await pool.query(
    `
    SELECT 
      ${columns},
      TO_CHAR(joining_date, 'FMDD FMMonth, YYYY') AS formatted_joining_date
    FROM users

    ${filter}

    ORDER BY id DESC
    LIMIT ${LIMIT} OFFSET ${OFFSET}
    `,
    filterValues
  );

  res.status(200).json(new ApiResponse(200, "User info list", rows));
});

export const updateUser = asyncErrorHandler(async (req, res) => {
  const { error, value } = VUpdateUser.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const encrypt_pass = encrypt(value.password);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const permissionsString = JSON.stringify(value.permissions);

    await client.query(
      `
      UPDATE users SET 
        category = $1, name = $2, email = $3, ph_no = $4, joining_date = $5, designation = $6, description = $7, image = $8, password = $9, permissions = $10
      WHERE id = $11
   `,
      [
        value.category,
        value.name,
        value.email,
        value.ph_no,
        value.joining_date,
        value.designation,
        value.description,
        value.image,
        encrypt_pass,
        permissionsString,
        value.id,
      ]
    );

    const userId = value.id.toString();
    const userCategory = value.category;

    // delete old fee structure of that employee and replace with new one
    await client.query(
      "DELETE FROM employee_salary_structure WHERE employee_id = $1",
      [userId]
    );

    if (userCategory === "Teacher") {
      const valueToStore: {
        course_id: number | null;
        amount: number;
        salary_type: string;
        class_per_month: number | null;
      }[] = [];

      value.fee_structure_teacher.forEach((item: TeacherFeeStruct) => {
        valueToStore.push({
          course_id: item.course_id,
          salary_type: item.type,
          amount: item.amount,
          class_per_month: item.class_per_month,
        });
        valueToStore.push({
          course_id: item.course_id,
          salary_type: "workshop",
          amount: item.workshop ?? 0.0,
          class_per_month: null,
        });
        valueToStore.push({
          course_id: item.course_id,
          salary_type: "extra",
          amount: item.extra ?? 0.0,
          class_per_month: null,
        });
      });

      if (value.p_tax) {
        valueToStore.push({
          amount: value.p_tax,
          class_per_month: null,
          course_id: null,
          salary_type: "P_tax",
        });
      }

      await client.query(
        `
        INSERT INTO employee_salary_structure 
          (employee_id, course_id, salary_type, amount, class_per_month)
        VALUES
          ${generatePlaceholders(valueToStore.length, 5)}
      `,
        valueToStore.flatMap((item) => [
          userId,
          item.course_id,
          item.salary_type,
          item.amount,
          item.class_per_month,
        ])
      );
    } else if (userCategory === "Stuff") {
      await client.query(
        `
        INSERT INTO employee_salary_structure 
          (employee_id, course_id, salary_type, amount, amount_type)
        VALUES
          ${generatePlaceholders(value.fee_structure_stuff.length, 5)}
      `,
        value.fee_structure_stuff.flatMap((item: any) => [
          userId,
          null,
          item.fee_head,
          item.amount,
          item.amount_type,
        ])
      );
    }

    // update to the essl device
    await essl.updateUser({
      name: value.name,
      password: value.password,
      uid: userId,
      userid: userId,
    });

    res
      .status(201)
      .json(new ApiResponse(201, "User info has successfully updated"));

    await client.query("COMMIT");
  } catch (e: any) {
    await client.query("ROLLBACK");
    throw new ErrorHandler(400, e.message);
  } finally {
    client.release();
  }
});

export const deleteUser = asyncErrorHandler(async (req, res) => {
  const { error, value } = VSingleUser.validate(req.params ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // get the user which i want to delete

    const { rows, rowCount } = await client.query(
      "DELETE FROM users WHERE id = $1 RETURNING name, password",
      [value.id]
    );

    if (rowCount == 0)
      throw new ErrorHandler(400, "No user found with this id");

    const { isError, decrypted } = decrypt(rows[0].password);
    if (isError || !decrypted)
      throw new ErrorHandler(400, "User password is invalid");

    const userId = value.id.toString();
    // update to the essl device
    await essl.deleteUser({
      uid: userId,
      userid: userId,
      name: rows[0].name,
      password: decrypted,
    });

    res.status(200).json(new ApiResponse(200, "User Deleted"));

    await client.query("COMMIT");
  } catch (e: any) {
    await client.query("ROLLBACK");
    throw new ErrorHandler(400, e.message);
  } finally {
    client.release();
  }
});

export const getUserEnrolledCourseList = asyncErrorHandler(
  async (req: CustomRequest, res) => {
    const { rows } = await getAdmissions(req, req.user_info?.id);
    res.status(200).json(new ApiResponse(200, "User Admission List", rows));
  }
);

export const getUserSingleAdmissionData = asyncErrorHandler(
  async (req: CustomRequest, res) => {
    const { error, value } = VGetSingleAdmission.validate(req.params ?? {});
    if (error) throw new ErrorHandler(400, error.message);

    const response = await getSingleAdmissionData(
      value.form_id,
      req.user_info?.id
    );

    res
      .status(200)
      .json(new ApiResponse(200, "Single Admission Data", response));
  }
);

export const getUserLeaveRequest = asyncErrorHandler(
  async (req: CustomRequest, res) => {
    const { rows } = await getLeaveList(req, req.user_info?.id);
    res.status(200).json(new ApiResponse(200, "User Leave list", rows));
  }
);

export const getSingleTeacherDailyClassStatus = asyncErrorHandler(
  async (req: CustomRequest, res) => {
    const { error, value } = VSingleUser.validate({
      id: req.user_info?.id,
    });

    if (error) throw new ErrorHandler(400, error.message);

    // const { rows } = await pool.query(
    //   `
    //   SELECT
    //     c.name AS course_name,
    //     c.id,
    //     EXISTS (SELECT 1 FROM teacher_classes WHERE teacher_id = ess.employee_id AND course_id = c.id AND class_type = 'regular') AS regular,
    //     EXISTS (SELECT 1 FROM teacher_classes WHERE teacher_id = ess.employee_id AND course_id = c.id AND class_type = 'workshop') AS workshop,
    //     COALESCE((SELECT units FROM teacher_classes WHERE teacher_id = ess.employee_id AND course_id = c.id AND class_type = 'extra'), 0) AS extra
    //   FROM employee_salary_structure ess
    //   LEFT JOIN course c ON c.id = ess.course_id

    //   WHERE ess.employee_id = $1

    //   GROUP BY ess.employee_id, c.id
    //   `,
    //   [value.id]
    // )

    const { rows } = await pool.query(
      `
    SELECT 
      c.name AS course_name, 
      c.id,
      (COUNT(*) FILTER (WHERE tc.class_type = 'fixed' OR tc.class_type = 'per_class') > 0) AS regular,
      (COUNT(*) FILTER (WHERE tc.class_type = 'workshop') > 0) AS workshop,
      COALESCE(MAX(tc.units) FILTER (WHERE tc.class_type = 'extra'), 0) AS extra
    FROM employee_salary_structure ess 

    LEFT JOIN course c 
    ON c.id = ess.course_id

    LEFT JOIN teacher_classes tc 
    ON tc.teacher_id = ess.employee_id AND ess.course_id = tc.course_id

    WHERE ess.employee_id = $1 AND EXISTS (SELECT 1 FROM attendance WHERE employee_id = ess.employee_id AND attendance.date = CURRENT_DATE)

    GROUP BY ess.employee_id, c.id
    ORDER BY c.id
    `,
      [value.id]
    );

    res
      .status(200)
      .json(new ApiResponse(200, "One teacher daily class list", rows));
  }
);

export const manageTeacherDailyClassStatus = asyncErrorHandler(
  async (req: CustomRequest, res) => {
    const { error, value } = VUpdateTeacherClassStatus.validate(req.body ?? {});
    if (error) throw new ErrorHandler(400, error.message);

    if (value.length === 0) throw new ErrorHandler(400, "Nothing to save");

    const userId = req.user_info?.id;
    if (!userId) throw new ErrorHandler(401, "Unauthorize");

    await manageTeacherClassStatus({
      employee_id: userId,
      values: value,
    });

    res.status(200).json(new ApiResponse(200, "Class status updated"));

    // try {
    //   await client.query("BEGIN");

    //   //delete current date current teacher record to perfome replace activity
    //   await client.query("DELETE FROM teacher_classes WHERE teacher_id = $1 AND class_date = CURRENT_DATE", [userId]);

    //   const { rows } = await client.query(
    //     `
    //     SELECT
    //         course_id,
    //         CASE WHEN salary_type = 'per_class' OR salary_type = 'fixed' THEN 'regular' ELSE salary_type END AS salary_type,
    //         ROUND(
    //             CASE
    //                 WHEN salary_type = 'fixed'
    //                 THEN (amount / COALESCE(class_per_month, 1))
    //                 ELSE amount
    //             END,
    //             2
    //         ) AS earn_per_course
    //     FROM employee_salary_structure ess
    //     WHERE ess.employee_id = $1;
    //     `,
    //     [userId]
    //   )

    //   const valueToStore: { course_id: number; class_type: string; units: number, daily_earning : number }[] = []
    //   // modify the value accoding my database setup
    //   value.forEach(item => {
    //     if (item.regular == true) {
    //       const income = rows.find(incomeItem => incomeItem.course_id == item.id && incomeItem.salary_type == 'regular')?.earn_per_course ?? 0;
    //       valueToStore.push({
    //         course_id: item.id,
    //         class_type: 'regular',
    //         units: 1,
    //         daily_earning : income
    //       });
    //     }
    //     if (item.workshop == true) {
    //       const income = rows.find(incomeItem => incomeItem.course_id == item.id && incomeItem.salary_type == 'workshop')?.earn_per_course ?? 0;
    //       valueToStore.push({
    //         course_id: item.id,
    //         class_type: 'workshop',
    //         units: 1,
    //         daily_earning : income
    //       });
    //     }
    //     if (item.extra > 0) {
    //       const income = rows.find(incomeItem => incomeItem.course_id == item.id && incomeItem.salary_type == 'extra')?.earn_per_course ?? 0;
    //       valueToStore.push({
    //         course_id: item.id,
    //         class_type: 'extra',
    //         units: item.extra,
    //         daily_earning : income * parseInt(item.extra)
    //       });
    //     }
    //   })

    //   // now add new data to the teacher class table
    //   await client.query(
    //     `
    //     INSERT INTO teacher_classes (teacher_id, course_id, class_type, units, daily_earning)
    //     VALUES ${generatePlaceholders(valueToStore.length, 5)}
    //     `,
    //     valueToStore.flatMap(item => [userId, item.course_id, item.class_type, item.units, item.daily_earning])
    //   )
    //   await client.query("COMMIT");

    //   res.status(200).json(new ApiResponse(200, "Class status updated"))
    // } catch (error: any) {
    //   await client.query("ROLLBACK");
    //   throw new ErrorHandler(400, error.message)
    // } finally {
    //   client.release()
    // }
  }
);

/**
 * Generate payslips in a streaming + batched fashion.
 * - Expects req.body: { month: "YYYY-MM", staff_id: number[], role: "Teacher" }
 * - Writes/updates into payslip(user_id, payslip_data, month)
 */

export const generatePayslip = asyncErrorHandler(async (req, res, next) => {
  const { error, value } = VGeneratePayslip.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const employeeIds = (value.staff_id ?? []) as number[];
  if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
    throw new ErrorHandler(400, "No employee selected for payslip generation");
  }

  if (value.role !== "Teacher") {
    throw new ErrorHandler(
      400,
      "Currently payslip generation is only available for Teachers"
    );
  }

  // Expect "YYYY-MM"
  if (!/^\d{4}-\d{2}$/.test(value.month)) {
    throw new ErrorHandler(
      400,
      "Invalid month format. Use 'YYYY-MM' (e.g., 2025-08)."
    );
  }
  const monthStart = `${value.month}-01`;
  const monthDate = new Date(monthStart);
  if (isNaN(monthDate.getTime())) {
    throw new ErrorHandler(400, "Invalid month value.");
  }

  const sql = generateTeacherPayslipQuery(employeeIds);
  if (!sql) throw new ErrorHandler(500, "Failed to build payslip query.");

  const client = await pool.connect();
  const MAX_BATCH = 100;
  let batchValues: any[] = [];
  let batchCount = 0;
  let totalProcessed = 0;

  const buildPlaceholders = (rows: number, cols: number) =>
    Array.from({ length: rows }, (_, i) => {
      const base = i * cols;
      return `($${base + 1}, $${base + 2}, $${base + 3})`;
    }).join(", ");

  const flushBatch = async () => {
    if (batchCount === 0) return;
    const insertSql = `
      INSERT INTO payslip (user_id, payslip_data, month)
      VALUES ${buildPlaceholders(batchCount, 3)}
      ON CONFLICT (user_id, month)
      DO UPDATE SET
        payslip_data = EXCLUDED.payslip_data,
        updated_at = NOW()
    `;
    await client.query(insertSql, batchValues);
    totalProcessed += batchCount;
    batchValues = [];
    batchCount = 0;
  };

  try {
    await client.query("BEGIN");

    // Wrap streaming in a promise
    await new Promise<void>((resolve, reject) => {
      const stream = new QueryStream(sql, [...employeeIds, monthStart], {
        batchSize: MAX_BATCH,
      });
      const pgStream = client.query(stream);

      pgStream.on("data", async (row: any) => {
        pgStream.pause();

        try {
          const payslipJson = JSON.stringify(row);
          batchValues.push(row.user_id, payslipJson, monthStart);
          batchCount++;
          if (batchCount >= MAX_BATCH) {
            await flushBatch();
          }
          pgStream.resume();
        } catch (err) {
          reject(err);
        }
      });

      pgStream.on("end", async () => {
        try {
          await flushBatch();
          resolve();
        } catch (err) {
          reject(err);
        }
      });

      pgStream.on("error", (err: any) => {
        reject(err);
      });
    });

    await client.query("COMMIT");
    res.status(200).json({
      ok: true,
      message: "Payslip generation completed.",
      month: value.month,
      processed: totalProcessed,
    });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    next(err); // Pass properly to error middleware
  } finally {
    client.release();
  }
});

export const getPayslip = asyncErrorHandler(async (req: CustomRequest, res) => {
  const { error, value } = VGetPayslip.validate({
    ...req.params,
    ...req.query,
  });
  if (error) throw new ErrorHandler(400, error.message);

  if (!/^\d{4}-\d{2}$/.test(value.month)) {
    throw new ErrorHandler(
      400,
      "Invalid month format. Use 'YYYY-MM' (e.g., 2025-08)."
    );
  }
  const monthStart = `${value.month}-01`;
  const monthDate = new Date(monthStart);
  if (isNaN(monthDate.getTime())) {
    throw new ErrorHandler(400, "Invalid month value.");
  }

  const { rowCount, rows } = await pool.query(
    `
    SELECT 
     *,
     TO_CHAR(month, 'Month YYYY') as payperiod,
     TO_CHAR(updated_at, 'DD FMMonth YYYY') as generated_date
    FROM payslip
    WHERE user_id = $1 AND month = $2
    `,
    [value.id, monthStart]
  );

  if (rowCount === 0)
    throw new ErrorHandler(404, "No payslip found please generate it first");

  const rowParseData = JSON.parse(rows[0].payslip_data);
  const onHandSalary = parseFloat(rowParseData.net_amount);

  const payslipData = {
    company: {
      name: "Global Technical Institute",
      address:
        "Beliaghata 17A, Haramohan Ghosh Lane, Kolkata 700085 Landmark: Near Surah Kanya Vidyalaya",
    },
    payPeriod: rows[0].payperiod,
    amountInWords: numberToWords(onHandSalary),
    generatedDate: rows[0].generated_date,
    employee: {
      name: rowParseData.name,
      // id: "EMP001",
      designation: rowParseData.designation,
      // department: "Mathematics",
      joinDate: rowParseData.joindate,
      type: rowParseData.type === "Teacher" ? "teacher" : "stuff", // or "staff" or "mixed"

      // For teachers
      // classes: [
      //   { name: "Mathematics Grade 10", count: 20, rate: 500 },
      //   { name: "Physics Grade 11", count: 15, rate: 600 }
      // ],
      classes: rowParseData.classes,
      // fixedCourses: [
      //   { name: "Advanced Calculus", amount: 5000 }
      // ],

      fixedCourses: rowParseData.fixedcourses,

      workshops: rowParseData.workshops,

      // workshops: [
      //   {
      //     name: "Advanced Mathematics Workshop",
      //     type: "Workshop",
      //     sessions: 8,
      //     rate: 750
      //   },
      //   {
      //     name: "Weekend Physics Extra Classes",
      //     type: "Extra Class",
      //     sessions: 12,
      //     rate: 600
      //   },
      //   {
      //     name: "Teacher Training Program",
      //     type: "Training",
      //     sessions: 16,
      //     rate: 500
      //   },
      //   {
      //     name: "Educational Technology Seminar",
      //     type: "Seminar",
      //     sessions: 4,
      //     rate: 800
      //   }
      // ],

      // For staff
      // basic: 15000,
      // hra: 6000,
      // medical: 2000,

      // Common
      // deductions: [
      //   { name: "PF", amount: 1800 },
      //   { name: "TDS", amount: 500 }
      // ],
      totalDeductions: 0,
      grossAmount: 0,
      netAmount: onHandSalary,
    },
  };
  res.render("payslip.ejs", payslipData);
});

export const getPayslipList = asyncErrorHandler(async (req, res) => {
  const { error, value } = VGetPayslipList.validate(req.query);
  if (error) throw new ErrorHandler(400, error.message);

  let filter = "WHERE u.category != 'Admin'";
  const filterValues: string[] = [];
  let placeholdernum = 1;

  if (value.category) {
    filter += ` AND u.category = $${placeholdernum++}`;
    filterValues.push(value.category);
  }

  if (!/^\d{4}-\d{2}$/.test(value.month)) {
    throw new ErrorHandler(
      400,
      "Invalid month format. Use 'YYYY-MM' (e.g., 2025-08)."
    );
  }
  const monthStart = `${value.month}-01`;
  const monthDate = new Date(monthStart);
  if (isNaN(monthDate.getTime())) {
    throw new ErrorHandler(400, "Invalid month value.");
  }

  filterValues.push(monthStart);

  const { rows } = await pool.query(
    `
     SELECT
      u.id,
      u.name,
      u.image,
      u.designation,
      EXISTS (
        SELECT 1 
        FROM payslip p 
        WHERE p.user_id = u.id AND month = $${placeholdernum++}
      ) AS payslip_generated

    FROM users u

     ${filter}
    `,
    filterValues
  );

  res.status(200).json(new ApiResponse(200, "", rows));
});

// Loan
export const addLoanOrAdvancePayment = asyncErrorHandler(async (req, res) => {
  const { error, value } = VAddLoanOrAdvancePayment.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  await pool.query(
    `INSERT INTO employee_loan_or_advance_payment (user_id, total_amount, monthly_return_amount) VALUES ($1, $2, $3)`,
    [value.user_id, value.total_amount, value.monthly_return_amount]
  );

  res.status(201).json(new ApiResponse(201, "Information successfully saved"));
});

export const getLoanList = asyncErrorHandler(async (req, res) => {
  let filter = "";
  const filterValues: string[] = [];
  let placeholder = 1;

  if (req.query.category) {
    filter = `WHERE u.category = $${placeholder++}`;
    filterValues.push(req.query.category.toString());
  }

  const { rows } = await pool.query(
    `
    SELECT
     elap.id,
     u.id AS user_id,
     u.name,
     u.image,
     elap.total_amount,
     elap.monthly_return_amount
    FROM employee_loan_or_advance_payment elap

    LEFT JOIN users u
    ON u.id = elap.user_id

    ${filter}
  `,
    filterValues
  );

  res.status(200).json(new ApiResponse(200, "", rows));
});

export const getSingleLoanInfo = asyncErrorHandler(async (req, res) => {
  const { error, value } = VSingleLoan.validate(req.params ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const { rows, rowCount } = await pool.query(
    "SELECT * FROM employee_loan_or_advance_payment WHERE id = $1",
    [value.id]
  );

  if (rowCount === 0) throw new ErrorHandler(400, "No row found");

  res.status(200).json(new ApiResponse(200, "", rows[0]));
});

export const updateLoadnInfo = asyncErrorHandler(async (req, res) => {
  const { error, value } = VUpdateLoanOrAdvancePayment.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  await pool.query(
    "UPDATE employee_loan_or_advance_payment SET total_amount = $1, user_id = $2, monthly_return_amount = $3 WHERE id = $4",
    [value.total_amount, value.user_id, value.monthly_return_amount, value.id]
  );

  res
    .status(200)
    .json(new ApiResponse(200, "Information successfully updated"));
});
