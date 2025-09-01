// Simple function to get available leave and requested days count
export async function getLeaveBalance(db: any, employeeId: number, fromDate: string, toDate: string) {
    const query = `
        WITH monthly_holidays AS (
            SELECT 
                DATE_TRUNC('month', h.date) AS month,
                COUNT(*) AS holiday_count
            FROM holiday h
            GROUP BY DATE_TRUNC('month', h.date)
        ),
        employee_info AS (
            SELECT 
                u.id,
                u.joining_date + INTERVAL '1 year' AS eligible_start_date
            FROM users u
            WHERE u.id = $1
        ),
        valid_months AS (
            SELECT COUNT(*) AS eligible_months
            FROM (
                SELECT DATE_TRUNC('month', a.date) AS month
                FROM attendance a
                JOIN employee_info ei ON ei.id = a.employee_id
                LEFT JOIN monthly_holidays mh ON mh.month = DATE_TRUNC('month', a.date)
                WHERE a.date >= ei.eligible_start_date
                  AND a.date < DATE_TRUNC('month', CURRENT_DATE)
                GROUP BY DATE_TRUNC('month', a.date), COALESCE(mh.holiday_count, 0)
                HAVING COUNT(*) FILTER (WHERE a.status IN ('Present', 'Leave')) >= 
                       (26 - COALESCE(mh.holiday_count, 0))
            ) vm
        ),
        total_leave_info AS (
            SELECT COALESCE(SUM(l.to_date - l.from_date + 1), 0) AS total_taken_leave
            FROM employee_info ei
            LEFT JOIN leave l ON l.employee_id = ei.id
                AND l.status = 2 -- Approved leaves only
                AND l.from_date >= ei.eligible_start_date
        )
        SELECT
            GREATEST(0, COALESCE(vm.eligible_months, 0) - COALESCE(tli.total_taken_leave, 0)) AS total_available_leave,
            ($3::date - $2::date + 1) AS count_of_from_and_to
        FROM employee_info ei
        LEFT JOIN valid_months vm ON true
        LEFT JOIN total_leave_info tli ON true;
    `;

    try {
        const result = await db.query(query, [employeeId, fromDate, toDate]);

        if (result.rows.length === 0) {
            return {
                total_available_leave: 0,
                count_of_from_and_to: 0
            };
        }

        const data = result.rows[0];

        return {
            total_available_leave: parseInt(data.total_available_leave) || 0,
            count_of_from_and_to: parseInt(data.count_of_from_and_to) || 0
        };

    } catch (error) {
        console.error('Error getting leave balance:', error);
        return {
            total_available_leave: 0,
            count_of_from_and_to: 0
        };
    }
}