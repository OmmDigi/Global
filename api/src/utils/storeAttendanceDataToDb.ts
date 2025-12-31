import { pool } from "../config/db";
import { TFinalPunch } from "../types";

export const storeAttendanceDataToDb = async (finalPunches: TFinalPunch[]) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let datePlaceholder = "";
    let employeeIdPlaceholder = "";
    let onlyEmployeeIdPlaceholder = "";
    const valuesToSearch: any[] = [];
    const onlyEmployeeIds : any[] = [];
    for (let i = 0; i < finalPunches.length; i++) {
      if (datePlaceholder === "") {
        datePlaceholder += `$${i * 2 + 1}`;
      } else {
        datePlaceholder += `, $${i * 2 + 1}`;
      }

      if (employeeIdPlaceholder === "") {
        employeeIdPlaceholder += `$${i * 2 + 2}`;
      } else {
        employeeIdPlaceholder += `, $${i * 2 + 2}`;
      }

      if (onlyEmployeeIdPlaceholder === "") {
        onlyEmployeeIdPlaceholder += `$${i + 1}`;
      } else {
        onlyEmployeeIdPlaceholder += `, $${i + 1}`;
      }

      valuesToSearch.push(finalPunches[i].date);
      valuesToSearch.push(finalPunches[i].userId);
      onlyEmployeeIds.push(finalPunches[i].userId);
    }

    // get employee attedance data with date and employee_id
    const { rows } = await client.query(
      `SELECT *, TO_CHAR(date, 'YYYY-MM-DD') AS date FROM attendance WHERE date IN (${datePlaceholder}) AND employee_id IN (${employeeIdPlaceholder})`,
      valuesToSearch
    );

    const { rows : employee } = await client.query(`SELECT id FROM users WHERE id IN (${onlyEmployeeIdPlaceholder})`, onlyEmployeeIds)

    const dataToInsert: TFinalPunch[] = [];
    const dataToUpdate: TFinalPunch[] = [];

    for (const punch of finalPunches) {
      // now will check is the list of employee already provide attendace or not
      // if attendace record avilable than update the out time only else insert a new record of attendace with in time

      const employeeExistIndex = employee.findIndex((row : any) => row.id == punch.userId);

      if(employeeExistIndex === -1) continue;

      const index = rows.findIndex(
        (row: any) => row.employee_id == punch.userId && row.date == punch.date
      );

      if (index == -1 && employeeExistIndex != -1) {
        // than no record avilable insert a new row in attendace table
        dataToInsert.push(punch);
        if(punch.inTime != punch.outTime) {
          dataToUpdate.push(punch);
        }
      } else {
        // update the outtime
        dataToUpdate.push(punch);
      }

    }

    if (dataToInsert.length !== 0) {
      const insertPlaceholder = dataToInsert
        .map(
          (_, index) =>
            `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${
              index * 5 + 4
            }, $${index * 5 + 5})`
        )
        .join(", ");

      const insertQuery = `
         INSERT INTO attendance (employee_id, in_time, out_time, status, date) VALUES ${insertPlaceholder}
        `;

      await client.query(
        insertQuery,
        dataToInsert.flatMap((item) => [
          item.userId,
          item.inTime,
          null,
          item.status,
          item.date,
        ])
      );
    }

    if (dataToUpdate.length !== 0) {
      const updatePlaceholder = dataToUpdate
        .map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`)
        .join(", ");
      const updateQuery = `
          UPDATE attendance AS a
          SET out_time = v.new_time::timestamp
          FROM (VALUES ${updatePlaceholder}) AS v(employee_id, new_time, date)
          WHERE a.employee_id = v.employee_id::BIGINT AND v.new_time::timestamp > in_time
          AND a.date = v.date::DATE;
        `;
      await client.query(
        updateQuery,
        dataToUpdate.flatMap((item) => [item.userId, item.outTime, item.date])
      );
    }

    await client.query("COMMIT");

    return {
      success: true,
      message: "Done",
    };
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.log(error)
    return {
      success: false,
      message: error.message,
    };
  } finally {
    client.release();
  }
};
