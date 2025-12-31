export const generateTeacherPayslipQuery = (teacher_ids: number[]) => {
    const teacherPlaceholder = teacher_ids
        .map((_, index) => `$${index + 1}`)
        .join(", ");
    return `SELECT
        u.id AS user_id,
        u.name,
        TO_CHAR(u.joining_date, 'DD Mon, YYYY') AS joindate,
        u.designation,
        'Teacher' AS type,
        SUM(ess2.total_earning) AS net_amount,
        JSON_AGG(
          JSON_OBJECT(
          'name' : ess2.course_name,
          'count' : ess2.count,
          'rate' : ess2.rate
          )
        ) FILTER (WHERE ess2.salary_type = 'per_class') AS classes, -- regulare per_class

        JSON_AGG(
          JSON_OBJECT(
          'name' : ess2.course_name,
          'amount' : ess2.total_earning
          )
        ) FILTER (WHERE ess2.salary_type = 'fixed') AS fixedcourses, -- regulare fixedcourses

        JSON_AGG(
          JSON_OBJECT(
          'name' : ess2.course_name,
          'type' : CASE WHEN ess2.salary_type = 'workshop' THEN 'Workshop' ELSE 'Extra Class' END,
          'sessions' : ess2.count,
          'rate' : ess2.rate
          )
        ) FILTER (WHERE ess2.salary_type = 'workshop' OR ess2.salary_type = 'extra') AS workshops -- regulare fixedCourses
        FROM users u

        INNER JOIN LATERAL (
          SELECT
            ess.employee_id,
            c.name AS course_name,
            ess.salary_type,
            MAX(ess.amount) AS rate,
            COALESCE(SUM(tc.units), 0) AS count,
            COALESCE(SUM(tc.daily_earning), 0) AS total_earning 
          FROM employee_salary_structure ess
            
          LEFT JOIN course c
          ON c.id = ess.course_id

          LEFT JOIN teacher_classes tc
          ON tc.teacher_id = ess.employee_id AND c.id = tc.course_id AND tc.class_type = ess.salary_type

          WHERE ess.employee_id = u.id AND tc.class_date >= DATE_TRUNC('month', $${teacher_ids.length + 1}::date) AND tc.class_date <  DATE_TRUNC('month', $${teacher_ids.length + 1}::date) + INTERVAL '1 month'

          GROUP BY ess.employee_id, c.id, ess.salary_type
        ) ess2 ON u.id = ess2.employee_id

        WHERE u.category = 'Teacher' AND u.id IN (${teacherPlaceholder})

        GROUP BY u.id

`;
};
