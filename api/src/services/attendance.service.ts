import { pool } from "../config/db";
import { generatePlaceholders } from "../utils/generatePlaceholders";
import { ErrorHandler } from "../utils/ErrorHandler";

interface IProps {
  employee_id: number;
  values: any[]
}

export const manageTeacherClassStatus = async (option: IProps) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    //delete current date current teacher record to perfome replace activity
    await client.query("DELETE FROM teacher_classes WHERE teacher_id = $1 AND class_date = CURRENT_DATE", [option.employee_id]);

    const { rows } = await client.query(
      `
        SELECT
            course_id,
            CASE WHEN salary_type = 'per_class' OR salary_type = 'fixed' THEN 'regular' ELSE salary_type END AS salary_type,
            ROUND(
                CASE 
                    WHEN salary_type = 'fixed' 
                    THEN (amount / COALESCE(class_per_month, 1)) 
                    ELSE amount 
                END, 
                2
            ) AS earn_per_course
        FROM employee_salary_structure ess
        WHERE ess.employee_id = $1;
        `,
      [option.employee_id]
    )

    const valueToStore: { course_id: number; class_type: string; units: number, daily_earning: number }[] = []
    // modify the value accoding my database setup
    option.values.forEach(item => {
      if (item.regular == true) {
        const income = rows.find(incomeItem => incomeItem.course_id == item.id && incomeItem.salary_type == 'regular')?.earn_per_course ?? 0;
        valueToStore.push({
          course_id: item.id,
          class_type: 'regular',
          units: 1,
          daily_earning: income
        });
      }
      if (item.workshop == true) {
        const income = rows.find(incomeItem => incomeItem.course_id == item.id && incomeItem.salary_type == 'workshop')?.earn_per_course ?? 0;
        valueToStore.push({
          course_id: item.id,
          class_type: 'workshop',
          units: 1,
          daily_earning: income
        });
      }
      if (item.extra > 0) {
        const income = rows.find(incomeItem => incomeItem.course_id == item.id && incomeItem.salary_type == 'extra')?.earn_per_course ?? 0;
        valueToStore.push({
          course_id: item.id,
          class_type: 'extra',
          units: item.extra,
          daily_earning: income * parseInt(item.extra)
        });
      }
    })

    // now add new data to the teacher class table
    if (valueToStore.length !== 0) {
      await client.query(
        `
        INSERT INTO teacher_classes (teacher_id, course_id, class_type, units, daily_earning)
        VALUES ${generatePlaceholders(valueToStore.length, 5)}
        `,
        valueToStore.flatMap(item => [option.employee_id, item.course_id, item.class_type, item.units, item.daily_earning])
      )
    }

    await client.query("COMMIT");

    // res.status(200).json(new ApiResponse(200, "Class status updated"))
    return "Class status updated"
  } catch (error: any) {
    await client.query("ROLLBACK");
    throw new ErrorHandler(400, error.message)
  } finally {
    client.release()
  }
}