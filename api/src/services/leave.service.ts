import { Request } from "express";
import { pool } from "../config/db";
import { parsePagination } from "../utils/parsePagination";

export const getLeaveList = async (req: Request, user_id?: number) => {
  const { TO_STRING } = parsePagination(req);

  return await pool.query(`
      SELECT 
        l.id,
        l.employee_id,
        u.name,
        TO_CHAR(l.from_date, 'DD FMMonth YYYY') AS from_date,
        TO_CHAR(l.to_date, 'DD FMMonth YYYY') AS to_date,
        l.reason,
        CASE WHEN l.status = 1 THEN 'Pending' WHEN l.status = 2 THEN 'Approved' ELSE 'Rejected' END AS status
      FROM leave l
  
      LEFT JOIN users u
      ON u.id = l.employee_id
  
      ORDER BY l.id DESC
  
      ${TO_STRING}
    `);
};
