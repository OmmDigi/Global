import { pool } from "../config/db";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { decrypt, encrypt } from "../services/crypto";
import { createToken } from "../services/jwt";
import { verifyUser } from "../services/user.service";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorHandler } from "../utils/ErrorHandler";
import { parsePagination } from "../utils/parsePagination";
import {
  VCreateUser,
  VGetUserList,
  VLoginUser,
  VSingleUser,
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

  const { category, id, permissions } = await verifyUser({
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
        course_id: number;
        amount: number;
        salary_type: string;
        class_per_month: number | null;
      }[] = [];

      value.fee_structure_teacher.forEach((item: TeacherFeeStruct) => {
        valueToStore.push({
          course_id: item.course_id,
          salary_type: item.type,
          amount: item.amount,
          class_per_month: item.class_per_month
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
          item.class_per_month
        ])
      );
    } else if (userCategory === "Stuff") {
      await client.query(
        `
        INSERT INTO employee_salary_structure 
          (employee_id, course_id, salary_type, amount)
        VALUES
          ${generatePlaceholders(value.fee_structure_stuff.length, 4)}
      `,
        value.fee_structure_stuff.flatMap((item: any) => [
          userID,
          null,
          item.fee_head,
          item.amount,
        ])
      );
    }

    // store data to the essl device
    // await essl.setUser({
    //   name: value.name,
    //   password: value.password,
    //   uid: userID,
    //   userid: userID,
    // });

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
          MAX(CASE WHEN salary_type IN ('fixed', 'per_class') THEN salary_type END) AS type,
          MAX(CASE WHEN salary_type IN ('fixed', 'per_class') THEN amount END) AS amount,
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

    rows[0].fee_structure_teacher = feeStructrueTeacher;
    rows[0].fee_structure_stuff = [];
  } else {
    const { rows: feeStructrueStaff } = await pool.query(
      `
      SELECT 
        salary_type AS fee_head,
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

    WHERE category != 'Admin'

    ORDER BY id DESC
    LIMIT ${LIMIT} OFFSET ${OFFSET}
    `
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
        course_id: number;
        amount: number;
        salary_type: string;
        class_per_month: number | null
      }[] = [];

      value.fee_structure_teacher.forEach((item: TeacherFeeStruct) => {
        valueToStore.push({
          course_id: item.course_id,
          salary_type: item.type,
          amount: item.amount,
          class_per_month: item.class_per_month
        });
        valueToStore.push({
          course_id: item.course_id,
          salary_type: "workshop",
          amount: item.workshop ?? 0.0,
          class_per_month: null
        });
        valueToStore.push({
          course_id: item.course_id,
          salary_type: "extra",
          amount: item.extra ?? 0.0,
          class_per_month: null
        });
      });

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
          item.class_per_month
        ])
      );
    } else if (userCategory === "Stuff") {
      await client.query(
        `
        INSERT INTO employee_salary_structure 
          (employee_id, course_id, salary_type, amount)
        VALUES
          ${generatePlaceholders(value.fee_structure_stuff.length, 4)}
      `,
        value.fee_structure_stuff.flatMap((item: any) => [
          userId,
          null,
          item.fee_head,
          item.amount,
        ])
      );
    }

    // update to the essl device
    // await essl.updateUser({
    //   name: value.name,
    //   password: value.password,
    //   uid: userId,
    //   userid: userId,
    // });

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

    // const userId = value.id.toString();
    // // update to the essl device
    // await essl.deleteUser({
    //   uid: userId,
    //   userid: userId,
    //   name: rows[0].name,
    //   password: decrypted
    // });

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

export const getSingleTeacherDailyClassStatus = asyncErrorHandler(async (req: CustomRequest, res) => {
  const { error, value } = VSingleUser.validate({
    id: req.user_info?.id
  })

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
      (COUNT(*) FILTER (WHERE tc.class_type = 'regular') > 0) AS regular,
      (COUNT(*) FILTER (WHERE tc.class_type = 'workshop') > 0) AS workshop,
      COALESCE(MAX(tc.units) FILTER (WHERE tc.class_type = 'extra'), 0) AS extra
    FROM employee_salary_structure ess 

    LEFT JOIN course c 
    ON c.id = ess.course_id

    LEFT JOIN teacher_classes tc 
    ON tc.teacher_id = ess.employee_id AND ess.course_id = tc.course_id

    WHERE ess.employee_id = $1

    GROUP BY ess.employee_id, c.id
    ORDER BY c.id
    `,
    [value.id]
  )

  res.status(200).json(new ApiResponse(200, "One teacher daily class list", rows))
})

export const manageTeacherDailyClassStatus = asyncErrorHandler(async (req: CustomRequest, res) => {
  const { error, value } = VUpdateTeacherClassStatus.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  if (value.length === 0) throw new ErrorHandler(400, "Nothing to save")

  const userId = req.user_info?.id;
  if (!userId) throw new ErrorHandler(401, "Unauthorize")

  await manageTeacherClassStatus({
    employee_id: userId,
    values: value
  })

  res.status(200).json(new ApiResponse(200, "Class status updated"))

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

})