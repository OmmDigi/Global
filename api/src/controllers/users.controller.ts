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
  VUpdateUser,
} from "../validator/users.validator";

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

  const { category, id } = await verifyUser({
    password: value.password,
    username: value.username,
  });

  const token = createToken({
    id,
    category,
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
    })
  );
});

export const createUser = asyncErrorHandler(async (req, res) => {
  const { error, value } = VCreateUser.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const encrypt_pass = encrypt(value.password);

  const { rowCount, rows } = await pool.query(
    `
      INSERT INTO users 
        (category, name, email, ph_no, joining_date, designation, description, image, password) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (email) DO NOTHING
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
      encrypt_pass,
    ]
  );

  if (rowCount === 0)
    throw new ErrorHandler(400, "User email already exists", ["email"]);

  res
    .status(201)
    .json(new ApiResponse(201, "New user has successfully created", rows[0]));
});

export const getOneUser = asyncErrorHandler(async (req, res) => {
  const { error, value } = VSingleUser.validate(req.params ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const user_id = value.id;

  const { rows, rowCount } = await pool.query(
    `
    SELECT 
      *,
      TO_CHAR(joining_date, 'FMDD FMMonth, YYYY') AS formatted_joining_date
    FROM users WHERE id = $1
    `,
    [user_id]
  );

  if (rowCount === 0) throw new ErrorHandler(404, "User Not Found");

  const { decrypted } = decrypt(rows[0].password);
  rows[0].password = decrypted;

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

  await pool.query(
    `
      UPDATE users SET 
        category = $1, name = $2, email = $3, ph_no = $4, joining_date = $5, designation = $6, description = $7, image = $8, password = $9
      WHERE id = $10
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
      value.id,
    ]
  );

  res
    .status(201)
    .json(new ApiResponse(201, "User info has successfully updated"));
});

export const deleteUser = asyncErrorHandler(async (req, res) => {
  const { error, value } = VSingleUser.validate(req.params ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  await pool.query("DELETE FROM users WHERE id = $1", [value.id]);

  res.status(200).json(new ApiResponse(200, "User Deleted"));
});
