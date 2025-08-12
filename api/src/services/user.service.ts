import { PoolClient } from "pg";
import { IUserCategory } from "../types";
import { pool } from "../config/db";
import { objectToSqlInsert } from "../utils/objectToSql";
import { ErrorHandler } from "../utils/ErrorHandler";
import { decrypt } from "./crypto";

type IProps = {
  category: IUserCategory;
  name: string;
  email: string;
  ph_no: string;
  designation: string;
  username: string;
  password: string;
  image?: string;
  description?: string;
  joining_date?: string;
  client?: PoolClient;
};

export const createNewUser = async (data: IProps) => {
  const pgClient = data.client ?? pool;
  delete data.client;

  const { columns, params, values } = objectToSqlInsert(data);

  try {
    const { rows, rowCount } = await pgClient.query(
      `INSERT INTO  users ${columns} VALUES ${params} RETURNING id, name, username, ph_no`,
      values
    );
    if (rowCount === 0)
      throw new ErrorHandler(500, "Unable to create new user");
    return {
      id: rows[0].id as number,
      name: rows[0].name as string,
      username: rows[0].username as string,
      ph_no: rows[0].ph_no as string,
    };
  } catch (error: any) {
    if (error.code === "23505") {
      // Duplicate entry (e.g., username already exists)
      throw new ErrorHandler(409, "Username already exists");
    }
    throw error; // rethrow other errors
  }
};

type IVerifyUsrProps = {
  username: string;
  password: string;
  client?: PoolClient;
};
export const verifyUser = async (data: IVerifyUsrProps) => {
  const pgClient = data.client ?? pool;

  const { rows, rowCount } = await pgClient.query(
    "SELECT id, password, category, permissions FROM users WHERE username = $1",
    [data.username]
  );

  if (rowCount === 0)
    throw new ErrorHandler(404, "Unable to find your account", ["username"]);

  const { isError, decrypted } = decrypt(rows[0].password);
  if (isError || decrypted !== data.password)
    throw new ErrorHandler(400, "Wrong Password", ["password"]);

  return {
    id: rows[0].id as number,
    category: rows[0].category as string,
    permissions : (rows[0].permissions ?? '[]') as string
  };
};
