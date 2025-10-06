import QueryStream from "pg-query-stream";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { ErrorHandler } from "../utils/ErrorHandler";
import { pool } from "../config/db";
import ExcelJS from "exceljs";
import {
  VGenerateUrl,
  VGetNewAdmissionReport,
  VInventoryReport,
  VMonthlyPaymentReport,
  VPaymentReport,
} from "../validator/excel.validator";
import { ApiResponse } from "../utils/ApiResponse";
import { createToken } from "../services/jwt";
import { VCreateEmployeeSalarySheet } from "../validator/users.validator";
import { getExcelColumnName } from "../utils/getExcelColumnName";

const urls = new Map<string, { url: string; route_id: number }>();
const HOST_URL = process.env.API_HOST_URL;
urls.set("payment_report", {
  url: `${HOST_URL}/api/v1/excel/payment-report`,
  route_id: 15,
});
urls.set("admission_report", {
  url: `${HOST_URL}/api/v1/excel/admission-report`,
  route_id: 6,
});
urls.set("salary_sheet", {
  url: `${HOST_URL}/api/v1/excel/salary-sheet`,
  route_id: 11,
});
urls.set("inventory_report", {
  url: `${HOST_URL}/api/v1/excel/inventory-report`,
  route_id: 8,
});

urls.set("monthly_payment_report", {
  url: `${HOST_URL}/api/v1/excel/monthly-payment-report`,
  route_id: 8,
});

urls.set("fee_summary_report", {
  url: `${HOST_URL}/api/v1/excel/fee-summery`,
  route_id : 8
})

export const generateUrl = asyncErrorHandler(async (req, res) => {
  const { error, value } = VGenerateUrl.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const urlinfo = urls.get(value.type);
  if (!urlinfo) throw new ErrorHandler(404, "No route found");

  const token = createToken(
    {
      route_id: urlinfo.route_id,
    },
    { expiresIn: "60s" }
  );

  const reportUrl = `${urlinfo.url}?${value.query}&token=${token}`;
  res.status(201).json(new ApiResponse(201, "Signed Url Created", reportUrl));
});

//admission excel report
export const getAdmissionExcelReport = asyncErrorHandler(async (req, res) => {
  const { error, value } = VGetNewAdmissionReport.validate(req.query);
  if (error) throw new ErrorHandler(400, error.message);

  // Set response headers for streaming
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="Admission_Report.xlsx"'
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  let filter = "";
  const filterValues: string[] = [];
  let placeholder = 1;

  if (value.from_date && value.to_date) {
    if (filter == "") {
      filter = `WHERE ff.created_at BETWEEN $${placeholder++}::date AND $${placeholder++}::date`;
    } else {
      filter += ` AND ff.created_at BETWEEN $${placeholder++}::date AND $${placeholder++}::date`;
    }
    filterValues.push(value.from_date);
    filterValues.push(value.to_date);
  }

  if (value.course) {
    if (filter == "") {
      filter = `WHERE c.id = $${placeholder++}`;
    } else {
      filter += ` AND c.id = $${placeholder++}`;
    }
    filterValues.push(value.course);
  }

  if (value.batch) {
    if (filter == "") {
      filter = `WHERE b.id = $${placeholder++}`;
    } else {
      filter += ` AND b.id = $${placeholder++}`;
    }
    filterValues.push(value.batch);
  }

  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: res,
    useStyles: true,
  });
  const worksheet = workbook.addWorksheet("Admission Report");

  // worksheet.mergeCells("A1:H1");
  // worksheet.getCell("A1").value = `Admission Report (${rows[0].name}) (${value.from_date} - ${value.to_date})`;
  worksheet.getCell("A1").font = {
    size: 20,
    bold: true,
    color: { argb: "000000" },
  };
  worksheet.getCell("A1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFF00" },
  };
  worksheet.getRow(1).height = 30;
  worksheet.getCell("A1").alignment = {
    horizontal: "left",
    vertical: "middle",
  };

  const rowArray = [
    "Sr Number",
    "Student Name",
    "Form Name",
    "Course Name",
    "Month Name",
    "Session Name",
    "Duration",
    "Total Amount",
    "All Fees Head",
  ];

  worksheet.addRow(rowArray);

  worksheet.mergeCells("A2:A3");
  worksheet.mergeCells("B2:B3");
  worksheet.mergeCells("C2:C3");
  worksheet.mergeCells("D2:D3");
  worksheet.mergeCells("E2:E3");
  worksheet.mergeCells("F2:F3");
  worksheet.mergeCells("G2:G3");
  worksheet.mergeCells("H2:H3");

  // Row styling (header row)
  const ROWS = [worksheet.getRow(2), worksheet.getRow(3)];
  ROWS.forEach((item) => {
    item.eachCell((cell) => {
      cell.style = {
        font: { bold: true, size: 14, color: { argb: "000000" } },
        alignment: { horizontal: "center", vertical: "middle" },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F4A460" },
        }, // Red background
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
          bottom: { style: "thin" },
        },
      };
    });
  });

  const client = await pool.connect();
  const query = new QueryStream(
    `
      WITH payment_calcluction AS (
        SELECT
          p.form_id,
          p.fee_head_id,
          SUM(p.amount) AS amount,
          COALESCE(SUM(p.amount) FILTER (WHERE p.mode = 'Discount'), 0) AS discount_amount,
          STRING_AGG(DISTINCT(p.bill_no), ' + ') AS bill_number,
          STRING_AGG(DISTINCT(p.payment_date)::text, ' + ') AS payment_date,
          p.month
        FROM payments p
              
        LEFT JOIN course_fee_head cfh
        ON cfh.id = p.fee_head_id

        GROUP BY p.form_id, p.fee_head_id, p.month
      ),

      payment_summery AS (
        SELECT
          pc.form_id,
          pc.fee_head_id,
          STRING_AGG(pc.amount::text, ' + ') AS amounts,
          STRING_AGG(pc.payment_date, ' + ') AS payment_dates,
          STRING_AGG(pc.bill_number, ' + ') AS bill_numbers,
          STRING_AGG(DISTINCT(TO_CHAR(pc.month, 'FMMonth, YYYY')), ' + ') AS months
        FROM payment_calcluction pc

        GROUP BY pc.form_id, pc.fee_head_id
      ),

      total_payment AS (
        SELECT
          p.form_id,
          SUM(p.amount) AS total_payment
        FROM payments p
        
        GROUP BY p.form_id
      )

      SELECT 
        row_number() OVER () AS sr_no,
        u.name,
        c.name AS course_name,
        b.month_name AS batch_name,
        ff.form_name,
        c.name AS course_name,
        b.month_name,
        s.name AS session_name,
        (c.duration || ' ' || c.duration_name) AS duration,
        COALESCE(
          JSON_AGG(ps) FILTER (WHERE ps.form_id IS NOT NULL),
          '[]'::json
        ) AS payment_summery_list,
        (SELECT json_agg(json_build_object('id', cfh.id, 'name', cfh.name) ORDER BY cfh.id) FROM course_fee_head cfh) AS course_fee_heads,
        COALESCE(MAX(tp.total_payment), 0) AS total_payment
      FROM fillup_forms ff

      LEFT JOIN users u
      ON u.id = ff.student_id

      LEFT JOIN enrolled_courses ec
      ON ec.form_id = ff.id

      LEFT JOIN course c
      ON c.id = ec.course_id

      LEFT JOIN batch b
      ON b.id = ec.batch_id

      LEFT JOIN session s
      ON s.id = ec.session_id

      LEFT JOIN payment_summery ps
      ON ps.form_id = ff.id

      LEFT JOIN total_payment tp
      ON tp.form_id = ff.id

      ${filter}
            
      GROUP BY ff.id, u.id, c.id, b.id, s.id
    `,
    filterValues,
    {
      batchSize: 10,
    }
  );

  const pgStream = client.query(query);

  // Process PostgreSQL stream data and append to Excel sheet
  let index = 0;
  const created_fee_head_column_info: {
    colname: string;
    fee_head_id: number;
    type: "fee_head" | "bill_no_date" | "month_name";
  }[] = [];

  pgStream.on("data", (data) => {
    pgStream.pause();

    if (index === 0) {
      worksheet.getCell(
        "A1"
      ).value = `Admission Report (${data.course_name}) (${data.batch_name}) (${value.from_date} - ${value.to_date})`;

      const ROW_NUMBER = 3;
      let currentCol = 9; // Start at column H (9th col)

      data.course_fee_heads.forEach((item: any) => {
        // 1️⃣ Head name
        const colName1 = getExcelColumnName(currentCol);
        const cell1 = worksheet.getCell(`${colName1}${ROW_NUMBER}`);
        cell1.value = item.name;
        created_fee_head_column_info.push({
          fee_head_id: item.id,
          colname: colName1,
          type: "fee_head",
        });

        cell1.style = {
          font: { bold: true, size: 14, color: { argb: "000000" } },
          alignment: { horizontal: "center", vertical: "middle" },
          border: {
            top: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" },
          },
        };

        // 3️⃣ Monthly fee → add extra "Month" column
        if (item.id === 4) {
          const colName3 = getExcelColumnName(currentCol + 1);
          const cell3 = worksheet.getCell(`${colName3}${ROW_NUMBER}`);
          cell3.value = "Month";
          cell1.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "f4b084" },
          };

          cell3.style = {
            font: { bold: true, size: 14, color: { argb: "000000" } },
            alignment: { horizontal: "center", vertical: "middle" },
            fill: {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "f4b084" },
            },
            border: {
              top: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
              bottom: { style: "thin" },
            },
          };

          created_fee_head_column_info.push({
            fee_head_id: item.id,
            colname: colName3,
            type: "month_name",
          });
        }

        // 2️⃣ Bill No & Date
        const colName2 = getExcelColumnName(
          currentCol + (item.id === 4 ? 2 : 1)
        );
        const cell2 = worksheet.getCell(`${colName2}${ROW_NUMBER}`);
        cell2.value = "Bill No & Date";
        created_fee_head_column_info.push({
          fee_head_id: item.id,
          colname: colName2,
          type: "bill_no_date",
        });
        cell2.style = {
          font: { bold: true, size: 14, color: { argb: "000000" } },
          alignment: { horizontal: "center", vertical: "middle" },
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "87CEEB" },
          },
          border: {
            top: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" },
          },
        };

        if (item.id === 4) {
          // shift by 3 for monthly
          currentCol += 3;
        } else {
          // shift by 2 for normal heads
          currentCol += 2;
        }
      });

      // Marge the heading
      worksheet.mergeCells(1, 1, 1, currentCol - 1);

      // Merge row 2 across all used columns
      worksheet.mergeCells(2, 9, 2, currentCol - 1);
    }

    const excelRow = worksheet.addRow([
      data.sr_no,
      data.name,
      data.form_name,
      data.course_name,
      data.month_name,
      data.session_name,
      data.duration,
      data.total_payment,
    ]);

    created_fee_head_column_info.forEach((item) => {
      const payment_summery_info = data.payment_summery_list.find(
        (payment: any) => payment.fee_head_id == item.fee_head_id
      );
      const cell = worksheet.getCell(`${item.colname}${excelRow.number}`);

      if (payment_summery_info) {
        if (item.type === "fee_head") {
          cell.value = payment_summery_info.amounts;
        } else if (item.type === "bill_no_date") {
          cell.value = `Bill No : ${payment_summery_info.bill_numbers}, DT : ${payment_summery_info.payment_dates}`;
        } else if (item.type === "month_name") {
          cell.value = payment_summery_info.months;
        }
      } else {
        cell.value = "-";
      }
    });

    // Style the data rows
    excelRow.eachCell((cell, cellNumber) => {
      // worksheet.mergeCells("A1:H1");
      cell.style = {
        font: {
          size: 12,
        },
        alignment: { horizontal: "center" },
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
          bottom: { style: "thin" },
        },
      };
    });

    index++;
    pgStream.resume();
  });

  pgStream.on("end", () => {
    workbook.commit();
    client.release(); // Release the client when done
  });

  pgStream.on("error", (err) => {
    client.release();
    workbook.commit();
    console.log(err);
    // throw new ErrorHandler(500, err.message);
  });
});

//money amount excel repor
export const generatePaymentExcelReport = asyncErrorHandler(
  async (req, res) => {
    const { error, value } = VPaymentReport.validate(req.query ?? {});
    if (error) throw new ErrorHandler(400, error.message);

    // Set response headers for streaming
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Payment_Report.xlsx"'
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    let filter = "";
    const filterValues: string[] = [];
    let placeholder = 1;

    if (value.from_date && value.to_date) {
      if (filter == "") {
        filter = `WHERE p.created_at BETWEEN $${placeholder++}::date AND $${placeholder++}::date`;
      } else {
        filter += ` AND p.created_at BETWEEN $${placeholder++}::date AND $${placeholder++}::date`;
      }
      filterValues.push(value.from_date);
      filterValues.push(value.to_date);
    }

    if (value.course) {
      if (filter == "") {
        filter = `WHERE c.id = $${placeholder++}`;
      } else {
        filter += ` AND c.id = $${placeholder++}`;
      }
      filterValues.push(value.course);
    }

    if (value.batch) {
      if (filter == "") {
        filter = `WHERE b.id = $${placeholder++}`;
      } else {
        filter += ` AND b.id = $${placeholder++}`;
      }
      filterValues.push(value.batch);
    }

    if (value.mode) {
      if (filter === "") {
        filter = `WHERE p.mode = $${placeholder++}`;
      } else {
        filter += ` AND p.mode = $${placeholder++}`;
      }
      filterValues.push(value.mode);
    }

    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: res,
      useStyles: true,
    });
    const worksheet = workbook.addWorksheet("Payment Report");

    worksheet.mergeCells("A1:I1");
    worksheet.getCell("A1").value = `Payment Report`;
    worksheet.getCell("A1").font = {
      size: 20,
      bold: true,
      color: { argb: "000000" },
    };
    worksheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF00" },
    };
    worksheet.getRow(1).height = 30;
    worksheet.getCell("A1").alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    worksheet.addRow([
      "Sr Number",
      "Student Name",
      "Course Name",
      "Batch",
      "Fee Head",
      "Amount Paid",
      "Mode",
      "Transition Id",
      "Date",
    ]);

    // Row styling (header row)
    worksheet.getRow(2).eachCell((cell) => {
      cell.style = {
        font: { bold: true, size: 14, color: { argb: "000000" } },
        alignment: { horizontal: "center", vertical: "middle" },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F4A460" },
        }, // Red background
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
          bottom: { style: "thin" },
        },
      };
    });

    const client = await pool.connect();
    const query = new QueryStream(
      `
        SELECT 
            row_number() OVER (ORDER BY u.id DESC) AS sr_no,
            u.name AS student_name,
            c.name AS course_name,
            b.month_name AS batch_name,
            cfh.name AS fee_head_name,
            p.amount,
            p.mode,
            p.transition_id,
            TO_CHAR(p.created_at, 'FMDD FMMonth, YYYY HH12:MI AM') AS date_time
        FROM payments p

        LEFT JOIN users u
        ON u.id = p.student_id

        LEFT JOIN enrolled_courses ec
        ON ec.form_id = p.form_id

        LEFT JOIN course c
        ON c.id = ec.course_id

        LEFT JOIN batch b
        ON b.id = ec.batch_id

        LEFT JOIN course_fee_head cfh
        ON cfh.id = p.fee_head_id

        ${filter}

        ORDER BY u.id DESC
      `,
      filterValues,
      {
        batchSize: 10,
      }
    );

    const pgStream = client.query(query);
    let totalAmount = 0;
    let index = -1;

    let courseInfo = {
      course_name: "",
      batch_name: "",
    };

    // Process PostgreSQL stream data and append to Excel sheet
    pgStream.on("data", (data) => {
      pgStream.pause();

      if (index == -1) {
        courseInfo.course_name = data.course_name;
        courseInfo.batch_name = data.batch_name;
        index++;
      }

      totalAmount += parseFloat(data.amount);

      const excelRow = worksheet.addRow(Object.values(data));
      // Style the data rows
      excelRow.eachCell((cell) => {
        cell.style = {
          font: {
            size: 12,
          },
          alignment: { horizontal: "center" },
          border: {
            top: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" },
          },
        };
      });

      pgStream.resume();
    });

    pgStream.on("end", () => {
      worksheet.getCell(
        "A1"
      ).value = `Payment Report For ${courseInfo.course_name}(${courseInfo.batch_name}) From : ${value.from_date} - ${value.to_date}`;
      const addedRow = worksheet.addRow([
        "",
        "",
        "",
        "",
        "",
        `Total : ₹${totalAmount}`,
      ]);
      addedRow.getCell(6).style = {
        font: {
          size: 12,
          bold: true,
        },
      };
      workbook.commit();
      client.release(); // Release the client when done
    });

    pgStream.on("error", (err) => {
      client.release();
      throw new ErrorHandler(500, err.message);
    });
  }
);

// export const exportTeacherPaymentReport = asyncErrorHandler(
//   async (req, res) => {
//     const { error, value } = VGenerateStuffSalarySheet.validate(req.query ?? {});
//     if (error) throw new ErrorHandler(400, error.message);

//     // Expect "YYYY-MM"
//     if (!/^\d{4}-\d{2}$/.test(value.month)) {
//       throw new ErrorHandler(
//         400,
//         "Invalid month format. Use 'YYYY-MM' (e.g., 2025-08)."
//       );
//     }
//     const monthStart = `${value.month}-01`;
//     const monthDate = new Date(monthStart);
//     if (isNaN(monthDate.getTime())) {
//       throw new ErrorHandler(400, "Invalid month value.");
//     }

//     const formatted = monthDate.toLocaleString("en-US", {
//       month: "short",
//       year: "numeric",
//     });

//     // 1. Set headers for Excel streaming
//     res.setHeader(
//       "Content-Disposition",
//       'attachment; filename="Teacher_Salary_Sheet.xlsx"'
//     );
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );

//     // 2. Create workbook in streaming mode
//     const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
//       stream: res,
//       useStyles: true,
//     });
//     const worksheet = workbook.addWorksheet("Teacher Payments");

//     // // Add headers
//     // const headerRow = worksheet.addRow([
//     //   "Name",
//     //   "Course Name",
//     //   "Type",
//     //   "Days Worked",
//     //   "Rate Per Day / Fixed",
//     //   "Daily Basic Pay",
//     //   "Grand Total",
//     //   "Sign",
//     // ]);

//     // // Style headers
//     // headerRow.height = 25;
//     // headerRow.eachCell((cell, colNumber) => {
//     //   cell.fill = {
//     //     type: "pattern",
//     //     pattern: "solid",
//     //     fgColor: { argb: "FFE0E0E0" },
//     //   };
//     //   cell.font = { bold: true };
//     //   cell.border = {
//     //     top: { style: "thin" },
//     //     left: { style: "thin" },
//     //     bottom: { style: "thin" },
//     //     right: { style: "thin" },
//     //   };
//     //   cell.alignment = { vertical: "middle", horizontal: "center" };
//     // });

//     // // Set column widths
//     // worksheet.columns = [
//     //   { width: 15 }, // Name
//     //   { width: 15 }, // Course Name
//     //   { width: 12 }, // Type
//     //   { width: 12 }, // Days Worked
//     //   { width: 18 }, // Rate Per Day
//     //   { width: 15 }, // Daily Basic Pay
//     //   { width: 12 }, // Grand Total
//     //   { width: 40 }, // Sign
//     // ];

//     worksheet.mergeCells("A1:I1");
//     worksheet.getCell("A1").value = `Payment Sheet For The Month Of ${formatted}`;
//     worksheet.getCell("A1").font = {
//       size: 20,
//       bold: true,
//       color: { argb: "000000" },
//     };
//     worksheet.getCell("A1").fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFFF00" },
//     };
//     worksheet.getRow(1).height = 30;
//     worksheet.getCell("A1").alignment = {
//       horizontal: "center",
//       vertical: "middle",
//     };

//     worksheet.addRow([
//       "Name",
//       "Course Name",
//       "Type",
//       "Days Worked",
//       "Rate Per Day / Fixed",
//       "Daily Basic Pay",
//       "Grand Total",
//       "Sign",
//     ]);

//     // Row styling (header row)
//     worksheet.getRow(2).eachCell((cell) => {
//       cell.style = {
//         font: { bold: true, size: 14, color: { argb: "000000" } },
//         alignment: { horizontal: "center", vertical: "middle" },
//         fill: {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "F4A460" },
//         }, // Red background
//         border: {
//           top: { style: "thin" },
//           left: { style: "thin" },
//           right: { style: "thin" },
//           bottom: { style: "thin" },
//         },
//       };
//     });

//     let rowIndex = 3;

//     // 3. Run your SQL query (returns JSON nested structure)
//     const query = `
//     WITH teacher_stats AS (
//       SELECT
//         u.id AS teacher_id,
//         u.name,
//         c.name AS course_name,
//         tc.class_type,
//         COUNT(DISTINCT tc.class_date) AS number_worked_days,
//         (
//           SELECT amount
//           FROM employee_salary_structure ess
//           WHERE ess.employee_id = u.id
//             AND ess.salary_type = tc.class_type
//             AND ess.course_id = c.id
//         ) AS rate_per_date,
//         SUM(tc.daily_earning) AS earning,
//         SUM(tc.units) AS total_classes_taken
//       FROM users u
//       JOIN teacher_classes tc ON tc.teacher_id = u.id
//       LEFT JOIN course c ON c.id = tc.course_id
//       WHERE u.category = 'Teacher'
//       GROUP BY u.id, u.name, c.id, c.name, tc.class_type
//     ),
//     course_grouped AS (
//       SELECT
//         teacher_id,
//         name,
//         course_name,
//         json_agg(
//           json_build_object(
//             'class_type', class_type,
//             'number_worked_days', number_worked_days,
//             'rate_per_date', rate_per_date,
//             'earning', earning,
//             'total_classes_taken', total_classes_taken
//           ) ORDER BY class_type
//         ) AS rows,
//         SUM(earning) AS course_total
//       FROM teacher_stats
//       GROUP BY teacher_id, name, course_name
//     )
//     SELECT
//       teacher_id,
//       name AS "teacherName",
//       json_agg(
//         json_build_object(
//           'courseName', course_name,
//           'rows', rows,
//           'courseTotal', course_total
//         ) ORDER BY course_name
//       ) AS courses,
//       SUM(course_total) AS "teacherTotal"
//     FROM course_grouped
//     GROUP BY teacher_id, name;
//   `;

//     const client = await pool.connect();
//     try {
//       const pgStream = client.query(new QueryStream(query));

//       pgStream.on("data", (teacher) => {
//         // Add teacher name in the first column, spanning multiple rows
//         const teacherStartRow = rowIndex;

//         // Process each course for this teacher
//         let teacherRowCount = 0;

//         teacher.courses.forEach((course: any) => {
//           // Add course name row
//           const courseStartRow = rowIndex;

//           course.rows.forEach((classData: any, index: number) => {
//             const row = worksheet.addRow([
//               index === 0 && teacherRowCount === 0 ? teacher.teacherName : "", // Teacher name only on first row
//               index === 0 ? course.courseName : "", // Course name only on first row of course
//               classData.class_type,
//               classData.number_worked_days,
//               classData.rate_per_date,
//               classData.earning,
//               teacher.teacherTotal && teacherRowCount === 0 && index === 0
//                 ? teacher.teacherTotal
//                 : "", // Teacher total only on very first row
//               "", // Sign column - empty for now
//             ]);

//             // Apply styling
//             row.height = 20;

//             // Style the row
//             row.eachCell((cell, colNumber) => {
//               cell.border = {
//                 top: { style: "thin" },
//                 left: { style: "thin" },
//                 bottom: { style: "thin" },
//                 right: { style: "thin" },
//               };
//               cell.alignment = { vertical: "middle", horizontal: "center" };
//             });

//             rowIndex++;
//             teacherRowCount++;
//           });
//         });

//         // Merge teacher name cells if there are multiple rows for this teacher
//         if (teacherRowCount > 1) {
//           worksheet.mergeCells(`A${teacherStartRow}:A${rowIndex - 1}`);
//         }

//         // Merge course name cells and course total cells for each course
//         let currentRow = teacherStartRow;
//         teacher.courses.forEach((course: any) => {
//           const courseRowCount = course.rows.length;
//           if (courseRowCount > 1) {
//             worksheet.mergeCells(
//               `B${currentRow}:B${currentRow + courseRowCount - 1}`
//             );
//           }
//           currentRow += courseRowCount;
//         });

//         // Merge teacher total cell (Grand Total column - column G AND H THE SING)
//         if (teacherRowCount > 1) {
//           worksheet.mergeCells(`G${teacherStartRow}:G${rowIndex - 1}`);
//           worksheet.mergeCells(`H${teacherStartRow}:H${rowIndex - 1}`);
//         }
//       });

//       pgStream.on("end", async () => {
//         await workbook.commit();
//         client.release();
//       });

//       pgStream.on("error", (err) => {
//         client.release();
//         console.error("Stream error:", err);
//         res.status(500).send("Error generating report");
//       });
//     } catch (err: any) {
//       client.release();
//       res.status(500).send("Error: " + err.message);
//     }
//   }
// );
// // Alternative version with monthly parameter
// // // Version with month/year parameters
// // export const exportSalarySlipReportByMonth = asyncErrorHandler(
// //   async (req, res) => {
// //     const { year, month } = req.query;
// //     // const targetYear = parseInt(year) || new Date().getFullYear();
// //     // const targetMonth = parseInt(month) || new Date().getMonth() + 1;

// //     const targetYear =  new Date().getFullYear();
// //     const targetMonth =  new Date().getMonth() + 1;

// //     res.setHeader(
// //       "Content-Disposition",
// //       `attachment; filename="SalarySlip_${targetYear}_${targetMonth.toString().padStart(2, '0')}.xlsx"`
// //     );
// //     res.setHeader(
// //       "Content-Type",
// //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
// //     );

// //     const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
// //       stream: res,
// //       useStyles: true,
// //     });
// //     const worksheet = workbook.addWorksheet(`Salary Slips ${targetYear}-${targetMonth}`);

// //     let rowIndex = 1;

// //     // Add headers (same as above)
// //     const headerRow = worksheet.addRow([
// //       "Name", "Payment Component", "Sunday", "Par Day Rate",
// //       "Gross Amount", "Deduction", "Net Amount Payable", "Sign"
// //     ]);

// //     headerRow.height = 25;
// //     headerRow.eachCell((cell, colNumber) => {
// //       cell.fill = {
// //         type: "pattern",
// //         pattern: "solid",
// //         fgColor: { argb: "FFE0E0E0" },
// //       };
// //       cell.font = { bold: true };
// //       cell.border = {
// //         top: { style: "thin" }, left: { style: "thin" },
// //         bottom: { style: "thin" }, right: { style: "thin" },
// //       };
// //       cell.alignment = { vertical: "middle", horizontal: "center" };
// //     });

// //     worksheet.columns = [
// //       { width: 15 }, { width: 20 }, { width: 10 }, { width: 12 },
// //       { width: 15 }, { width: 12 }, { width: 18 }, { width: 40 }
// //     ];

// //     rowIndex++;

// //     // Query with date parameters
// //     const query = `
// //       WITH employee_attendance AS (
// //         SELECT
// //           u.id AS employee_id,
// //           u.name AS employee_name,
// //           (
// //             SELECT COUNT(*)
// //             FROM attendance a
// //             WHERE a.employee_id = u.id
// //               AND a.status = 'Present'
// //               AND EXTRACT(YEAR FROM a.date) = $1
// //               AND EXTRACT(MONTH FROM a.date) = $2
// //           ) AS days_worked,
// //           (
// //             SELECT COUNT(*)
// //             FROM (
// //               SELECT generate_series(
// //                 ($1 || '-' || $2 || '-01')::date,
// //                 (($1 || '-' || $2 || '-01')::date + INTERVAL '1 month' - INTERVAL '1 day')::date,
// //                 '1 day'::interval
// //               )::date as day_date
// //             ) days
// //             WHERE EXTRACT(DOW FROM day_date) = 0
// //           ) AS sundays_count
// //         FROM users u
// //         WHERE EXISTS (SELECT 1 FROM employee_salary_structure ess WHERE ess.employee_id = u.id)
// //       ),
// //       employee_salary_components AS (
// //         SELECT
// //           ea.employee_id,
// //           ea.employee_name,
// //           ea.days_worked,
// //           ea.sundays_count,
// //           ess.salary_type,
// //           ess.amount,
// //           ess.amount_type,
// //           CASE
// //             WHEN ess.salary_type = 'BASIC' AND ess.amount_type = 'addition' THEN ess.amount
// //             ELSE 0
// //           END AS par_day_rate,
// //           CASE
// //             WHEN ess.amount_type = 'addition' THEN
// //               CASE
// //                 WHEN ess.salary_type = 'BASIC' THEN ess.amount * ea.days_worked
// //                 ELSE ess.amount
// //               END
// //             ELSE 0
// //           END AS gross_amount,
// //           CASE
// //             WHEN ess.amount_type = 'deduction' THEN ess.amount
// //             ELSE 0
// //           END AS deduction_amount
// //         FROM employee_attendance ea
// //         JOIN employee_salary_structure ess ON ess.employee_id = ea.employee_id
// //       ),
// //       employee_totals AS (
// //         SELECT
// //           employee_id,
// //           employee_name,
// //           days_worked,
// //           sundays_count,
// //           SUM(gross_amount) AS total_gross,
// //           SUM(deduction_amount) AS total_deduction,
// //           SUM(gross_amount) - SUM(deduction_amount) AS net_amount_payable
// //         FROM employee_salary_components
// //         GROUP BY employee_id, employee_name, days_worked, sundays_count
// //       )
// //       SELECT
// //         esc.employee_id,
// //         esc.employee_name,
// //         esc.days_worked,
// //         esc.sundays_count,
// //         et.net_amount_payable,
// //         json_agg(
// //           json_build_object(
// //             'salary_type', esc.salary_type,
// //             'amount', esc.amount,
// //             'amount_type', esc.amount_type,
// //             'par_day_rate', esc.par_day_rate,
// //             'gross_amount', esc.gross_amount,
// //             'deduction_amount', esc.deduction_amount
// //           ) ORDER BY
// //             CASE
// //               WHEN esc.salary_type = 'BASIC' THEN 1
// //               WHEN esc.salary_type = 'HRA' THEN 2
// //               WHEN esc.salary_type = 'MEDICAL' THEN 3
// //               WHEN esc.salary_type = 'PTAX' THEN 4
// //               ELSE 5
// //             END
// //         ) AS salary_components
// //       FROM employee_salary_components esc
// //       JOIN employee_totals et ON et.employee_id = esc.employee_id
// //       GROUP BY esc.employee_id, esc.employee_name, esc.days_worked, esc.sundays_count, et.net_amount_payable
// //       ORDER BY esc.employee_name;
// //     `;

// //     const client = await pool.connect();

// //     try {
// //       const pgStream = client.query(new QueryStream(query, [targetYear, targetMonth]));

// //       pgStream.on("data", (employee) => {
// //         const employeeStartRow = rowIndex;
// //         let componentCount = employee.salary_components.length;

// //         employee.salary_components.forEach((component : any, index : number) => {
// //           const isFirstRow = index === 0;

// //           const row = worksheet.addRow([
// //             isFirstRow ? employee.employee_name : "",
// //             component.salary_type,
// //             isFirstRow ? employee.sundays_count : "",
// //             component.par_day_rate > 0 ? component.par_day_rate : "",
// //             component.gross_amount > 0 ? component.gross_amount : "",
// //             component.deduction_amount > 0 ? component.deduction_amount : "",
// //             isFirstRow ? employee.net_amount_payable : "",
// //             "",
// //           ]);

// //           row.height = 20;
// //           row.eachCell((cell, colNumber) => {
// //             cell.border = {
// //               top: { style: "thin" }, left: { style: "thin" },
// //               bottom: { style: "thin" }, right: { style: "thin" },
// //             };
// //             cell.alignment = { vertical: "middle", horizontal: "center" };

// //             if ([4, 5, 6, 7].includes(colNumber) && cell.value) {
// //               cell.alignment = { vertical: "middle", horizontal: "right" };
// //             }
// //           });

// //           rowIndex++;
// //         });

// //         if (componentCount > 1) {
// //           const endRow = rowIndex - 1;
// //           worksheet.mergeCells(`A${employeeStartRow}:A${endRow}`);
// //           worksheet.mergeCells(`C${employeeStartRow}:C${endRow}`);
// //           worksheet.mergeCells(`G${employeeStartRow}:G${endRow}`);
// //           worksheet.mergeCells(`H${employeeStartRow}:H${endRow}`);
// //         }
// //       });

// //       pgStream.on("end", async () => {
// //         await workbook.commit();
// //         client.release();
// //       });

// //       pgStream.on("error", (err) => {
// //         client.release();
// //         console.error("Stream error:", err);
// //         res.status(500).send("Error generating salary slip report");
// //       });

// //     } catch (err : any) {
// //       client.release();
// //       res.status(500).send("Error: " + err.message);
// //     }
// //   }
// // );

// export const exportEmployeeSalaryReport = asyncErrorHandler(
//   async (req, res) => {
//     const { error, value } = VGenerateStuffSalarySheet.validate(req.query ?? {});
//     if (error) throw new ErrorHandler(400, error.message);

//     // Expect "YYYY-MM"
//     if (!/^\d{4}-\d{2}$/.test(value.month)) {
//       throw new ErrorHandler(
//         400,
//         "Invalid month format. Use 'YYYY-MM' (e.g., 2025-08)."
//       );
//     }
//     const monthStart = `${value.month}-01`;
//     const monthDate = new Date(monthStart);
//     if (isNaN(monthDate.getTime())) {
//       throw new ErrorHandler(400, "Invalid month value.");
//     }

//     const formatted = monthDate.toLocaleString("en-US", {
//       month: "short",
//       year: "numeric",
//     });

//     // 1. Set headers
//     res.setHeader(
//       "Content-Disposition",
//       'attachment; filename="Employee_Payment_Sheet.xlsx"'
//     );
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );

//     // 2. Create streaming workbook
//     const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
//       stream: res,
//       useStyles: true,
//     });
//     const worksheet = workbook.addWorksheet("Employee Salary");

//     worksheet.mergeCells("A1:I1");
//     worksheet.getCell("A1").value = `Payment Sheet For The Month Of ${formatted}`;
//     worksheet.getCell("A1").font = {
//       size: 20,
//       bold: true,
//       color: { argb: "000000" },
//     };
//     worksheet.getCell("A1").fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFFF00" },
//     };
//     worksheet.getRow(1).height = 30;
//     worksheet.getCell("A1").alignment = {
//       horizontal: "center",
//       vertical: "middle",
//     };

//     worksheet.addRow([
//       "Name",
//       "Payment Components",
//       null,
//       "Sunday",
//       "Per Day Rate",
//       "Gross Amount",
//       "Deduction",
//       "Net Payable Amount",
//       "Signature",
//     ]);

//     // Row styling (header row)
//     worksheet.getRow(2).eachCell((cell) => {
//       cell.style = {
//         font: { bold: true, size: 14, color: { argb: "000000" } },
//         alignment: { horizontal: "center", vertical: "middle" },
//         fill: {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: "F4A460" },
//         }, // Red background
//         border: {
//           top: { style: "thin" },
//           left: { style: "thin" },
//           right: { style: "thin" },
//           bottom: { style: "thin" },
//         },
//       };
//     });

//     // 3. Add headers
//     // const headerRow = worksheet.addRow([
//     //   "Name",
//     //   "Payment Component",
//     //   null,
//     //   "Sunday",
//     //   "Par Day Rate",
//     //   "Gross Amount",
//     //   "Deduction",
//     //   "Net Amount Payable",
//     //   "Sign",
//     // ]);
//     // headerRow.height = 25;

//     // Style header
//     // headerRow.eachCell((cell) => {
//     //   cell.fill = {
//     //     type: "pattern",
//     //     pattern: "solid",
//     //     fgColor: { argb: "FFE0E0E0" },
//     //   };
//     //   cell.font = { bold: true };
//     //   cell.border = {
//     //     top: { style: "thin" },
//     //     left: { style: "thin" },
//     //     bottom: { style: "thin" },
//     //     right: { style: "thin" },
//     //   };
//     //   cell.alignment = { vertical: "middle", horizontal: "center" };
//     // });

//     // Column widths
//     // worksheet.columns = [
//     //   { width: 20 }, // Name
//     //   { width: 20 }, // Payment Component
//     //   { width: 12 }, // Component Amount
//     //   { width: 15 }, // Sunday
//     //   { width: 15 }, // Per Day Rate
//     //   { width: 15 }, // Gross Amount
//     //   { width: 15 }, // Deduction
//     //   { width: 20 }, // Net Amount Payable
//     //   { width: 15 }, // Sign
//     // ];

//     // Merge header "Payment Component" across B1:C1
//     worksheet.mergeCells("B2:C2");

//     let rowIndex = 3;

//     // 4. SQL query for salary + attendance
//     const query = `
//       WITH emp_salary AS (
//         SELECT
//           e.id,
//           e.name,
//           json_agg(
//             json_build_object(
//               'salary_type', CASE WHEN ess.salary_type = 'base_salary' THEN 'BASIC PAY' WHEN ess.salary_type = 'P_tax' THEN 'P TAX' ELSE ess.salary_type END,
//               'amount', ess.amount,
//               'amount_type', ess.amount_type
//             )
//           ) AS salary_components
//         FROM users e
//         JOIN employee_salary_structure ess ON ess.employee_id = e.id
//         GROUP BY e.id, e.name
//       ),
//       attendance_summary AS (
//         SELECT
//           employee_id,
//           COUNT(*) FILTER (WHERE status = 'Present') AS present_days,
//           COUNT(DISTINCT date) FILTER (WHERE EXTRACT(DOW FROM date) = 0 AND status = 'Present') AS sunday_worked
//         FROM attendance
//         WHERE date_trunc('month', date) = date_trunc('month', $1::DATE) --CURRENT_DATE)
//         GROUP BY employee_id
//       )
//       SELECT
//         es.id,
//         es.name,
//         es.salary_components,
//         COALESCE(a.present_days, 0) AS present_days,
//         COALESCE(a.sunday_worked, 0) AS sunday_worked
//       FROM emp_salary es
//       JOIN attendance_summary a ON a.employee_id = es.id;
//     `;

//     const client = await pool.connect();
//     try {
//       const pgStream = client.query(new QueryStream(query, [monthStart], { batchSize: 10 }));

//       pgStream.on("data", (emp) => {
//         const salaryComponents = emp.salary_components;
//         // const presentDays = emp.present_days || 0;
//         const sundayWorked = emp.sunday_worked || 0;

//         let gross = 0;
//         let deduction = 0;

//         salaryComponents.forEach((comp: any) => {
//           if (comp.amount_type === "addition") gross += comp.amount;
//           else if (comp.amount_type === "deduction") deduction += comp.amount;
//         });

//         const perDayRate = Math.floor(gross / 30); // adjust if 30 days

//         gross += sundayWorked * perDayRate;
//         const netPay = gross - deduction;
//         const sundayPayTxt =
//           sundayWorked == 0 ? 0 : `${sundayWorked} x ${perDayRate}`;

//         const startRow = rowIndex;
//         const endRow = rowIndex + salaryComponents.length - 1;

//         // Add each component row
//         salaryComponents.forEach((comp: any, i: number) => {
//           const row = worksheet.addRow([
//             i === 0 ? emp.name : null, // Name only once
//             comp.salary_type,
//             comp.amount,
//             i === 0 ? sundayPayTxt : null,
//             i === 0 ? perDayRate : null,
//             i === 0 ? gross : null,
//             i === 0 ? deduction : null,
//             i === 0 ? netPay : null,
//             null,
//           ]);

//           row.height = 20;
//           row.eachCell((cell) => {
//             cell.border = {
//               top: { style: "thin" },
//               left: { style: "thin" },
//               bottom: { style: "thin" },
//               right: { style: "thin" },
//             };
//             cell.alignment = { vertical: "middle", horizontal: "center" };
//           });

//           rowIndex++;
//         });

//         // Merge cells like in StuffSalary.xlsx
//         if (salaryComponents.length > 1) {
//           worksheet.mergeCells(`A${startRow}:A${endRow}`); // Name
//           worksheet.mergeCells(`D${startRow}:D${endRow}`); // Sunday
//           worksheet.mergeCells(`E${startRow}:E${endRow}`); // Per Day Rate
//           worksheet.mergeCells(`F${startRow}:F${endRow}`); // Gross Amount
//           worksheet.mergeCells(`G${startRow}:G${endRow}`); // Deduction
//           worksheet.mergeCells(`H${startRow}:H${endRow}`); // Net Amount
//           worksheet.mergeCells(`I${startRow}:I${endRow}`); // Sign
//         }
//       });

//       pgStream.on("end", async () => {
//         await workbook.commit();
//         client.release();
//       });

//       pgStream.on("error", (err) => {
//         client.release();
//         console.error("Stream error:", err);
//         res.status(500).send("Error generating report");
//       });
//     } catch (err: any) {
//       client.release();
//       res.status(500).send("Error: " + err.message);
//     }
//   }
// );

export const createEmployeeSalarySheet = asyncErrorHandler(async (req, res) => {
  const { error, value } = VCreateEmployeeSalarySheet.validate(req.query ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const employeetype = value.role === "Teacher" ? "Teacher" : "Staff";

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

  const formatted = monthDate.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });

  // 1. Set headers
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${employeetype}_Payment_Sheet_${formatted.replace(
      " ",
      "_"
    )}.xlsx"`
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  // 2. Create streaming workbook
  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: res,
    useStyles: true,
  });
  const worksheet = workbook.addWorksheet("Employee Salary", {
    views: [
      {
        state: "frozen",
        ySplit: 2,
      },
    ],
  });

  if (employeetype === "Staff") {
    worksheet.mergeCells("A1:N1");
  } else {
    worksheet.mergeCells("A1:H1");
  }
  worksheet.getCell("A1").value = `Payment Sheet For The Month Of ${formatted}`;
  worksheet.getCell("A1").font = {
    size: 20,
    bold: true,
    color: { argb: "000000" },
  };
  worksheet.getCell("A1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFF00" },
  };
  worksheet.getRow(1).height = 30;
  worksheet.getCell("A1").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  if (employeetype === "Staff") {
    worksheet.addRow([
      "Name",
      "Present",
      "Absent",
      "Leave",
      "Holiday",
      "Sunday",
      "Payment Components",
      null,
      "Working Sunday",
      "Per Day Rate",
      "Gross Amount",
      "Deduction",
      "Net Payable Amount",
      "Signature",
    ]);
  } else {
    worksheet.addRow([
      "Name",
      // "Days Worked",
      "Course Name",
      "Type",
      "Fixed / Per Class Rate",
      "Class Taken",
      "Total",
      "Grand Total",
      "Signature",
    ]);
  }

  // Row styling (header row)
  worksheet.getRow(2).eachCell((cell) => {
    cell.style = {
      font: { bold: true, size: 14, color: { argb: "000000" } },
      alignment: { horizontal: "center", vertical: "middle" },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "F4A460" },
      }, // Red background
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        bottom: { style: "thin" },
      },
    };
  });

  if (employeetype === "Staff") {
    // Merge header "Payment Component" across B1:C1
    worksheet.mergeCells("G2:H2");
  }

  let rowIndex = 3;

  // 4. SQL query for salary + attendance
  let query = ``;

  if (employeetype === "Staff") {
    // query = `
    //   WITH month_days AS (
    //       -- Generate all dates for the current month
    //       SELECT generate_series(
    //           date_trunc('month', $1::DATE),
    //           (date_trunc('month', $1::DATE) + interval '1 month - 1 day')::DATE,
    //           interval '1 day'
    //       )::DATE AS dt
    //   ),
    //   working_days AS (
    //       -- Remove Sundays and holidays
    //       SELECT md.dt
    //       FROM month_days md
    //       LEFT JOIN holiday h ON h.date = md.dt
    //       WHERE EXTRACT(DOW FROM md.dt) <> 0  -- Exclude Sundays
    //         AND h.date IS NULL                -- Exclude holidays
    //   ),
    //   emp_salary AS (
    //       SELECT
    //           e.id,
    //           e.name,
    //           json_agg(
    //               json_build_object(
    //                   'salary_type', CASE
    //                                     WHEN ess.salary_type = 'base_salary' THEN 'BASIC PAY'
    //                                     WHEN ess.salary_type = 'P_tax' THEN 'P TAX'
    //                                     ELSE ess.salary_type
    //                                 END,
    //                   'amount', ess.amount,
    //                   'amount_type', ess.amount_type
    //               )
    //           ) AS salary_components
    //       FROM users e
    //       JOIN employee_salary_structure ess ON ess.employee_id = e.id
    //       WHERE e.category = 'Stuff'
    //       GROUP BY e.id, e.name
    //   ),
    //   attendance_summary AS (
    //       SELECT
    //           e.id AS employee_id,
    //           COUNT(*) FILTER (WHERE a.status = 'Present') AS present_days,
    //           COUNT(*) FILTER (WHERE a.status = 'Leave') AS leave_days,
    //           COUNT(DISTINCT a.date) FILTER (
    //               WHERE EXTRACT(DOW FROM a.date) = 0 AND a.status = 'Present'
    //           ) AS sunday_worked,
    //           COUNT(w.dt) AS total_working_days
    //       FROM users e
    //       JOIN working_days w ON TRUE
    //       LEFT JOIN attendance a
    //             ON a.employee_id = e.id
    //             AND a.date = w.dt
    //       WHERE e.category = 'Stuff'
    //       GROUP BY e.id
    //   )
    //   SELECT
    //       es.id,
    //       es.name,
    //       es.salary_components,
    //       COALESCE(a.present_days, 0) AS present_days,
    //       COALESCE(a.leave_days, 0) AS leave_days,
    //       COALESCE(a.sunday_worked, 0) AS sunday_worked,
    //       (a.total_working_days - (COALESCE(a.present_days,0) + COALESCE(a.leave_days,0))) AS absent_days
    //   FROM emp_salary es
    //   JOIN attendance_summary a ON a.employee_id = es.id

    //   --ORDER BY es.employee_id DESC
    //   `

    query = `
      WITH month_days AS (
          -- Generate all dates for the current month
          SELECT generate_series(
              date_trunc('month', $1::DATE), 
              (date_trunc('month', $1::DATE) + interval '1 month - 1 day')::DATE, 
              interval '1 day'
          )::DATE AS dt
      ),
      sundays_in_month AS (
        -- Count Sundays in the month
        SELECT COUNT(*) AS total_sundays
        FROM month_days
        WHERE EXTRACT(DOW FROM dt) = 0
      ),
      holidays_in_month AS (
          -- Pick holidays that fall in this month (excluding Sundays)
          SELECT h.date
          FROM holiday h
          JOIN month_days md ON h.date = md.dt
          WHERE EXTRACT(DOW FROM h.date) <> 0
      ),
      working_days AS (
          -- Remove Sundays and holidays
          SELECT md.dt
          FROM month_days md
          LEFT JOIN holiday h ON h.date = md.dt
          WHERE EXTRACT(DOW FROM md.dt) <> 0  -- Exclude Sundays
            AND h.date IS NULL                -- Exclude holidays
      ),
      emp_salary AS (
          SELECT 
              e.id,
              e.name,
              json_agg(
                  json_build_object(
                      'salary_type', CASE 
                                        WHEN ess.salary_type = 'base_salary' THEN 'BASIC PAY' 
                                        WHEN ess.salary_type = 'P_tax' THEN 'P TAX' 
                                        ELSE ess.salary_type 
                                    END,
                      'amount', ess.amount,
                      'amount_type', ess.amount_type
                  )
              ) AS salary_components
          FROM users e
          JOIN employee_salary_structure ess ON ess.employee_id = e.id
          WHERE e.category = 'Stuff'
          GROUP BY e.id, e.name
      ),
      attendance_summary AS (
          SELECT 
              e.id AS employee_id,
              COUNT(*) FILTER (WHERE a.status = 'Present') AS present_days,
              COUNT(*) FILTER (WHERE a.status = 'Leave') AS leave_days,
              COUNT(DISTINCT a.date) FILTER (
                  WHERE EXTRACT(DOW FROM a.date) = 0 AND a.status = 'Present'
              ) AS sunday_worked,
              COUNT(w.dt) AS total_working_days,
              (SELECT COUNT(*) FROM holidays_in_month) AS holiday_count,
              (SELECT total_sundays FROM sundays_in_month) AS total_sundays_in_month
          FROM users e
          JOIN working_days w ON TRUE
          LEFT JOIN attendance a 
                ON a.employee_id = e.id 
                AND a.date = w.dt
          WHERE e.category = 'Stuff'
          GROUP BY e.id
      )
      SELECT 
          es.id, 
          es.name,
          es.salary_components,
          COALESCE(a.present_days, 0) AS present_days,
          COALESCE(a.leave_days, 0) AS leave_days,
          COALESCE(a.sunday_worked, 0) AS sunday_worked,
          a.holiday_count,
          (a.total_working_days - (COALESCE(a.present_days,0) + COALESCE(a.leave_days,0))) AS absent_days,
          a.total_sundays_in_month
      FROM emp_salary es
      JOIN attendance_summary a ON a.employee_id = es.id;`;
  } else if (employeetype === "Teacher") {
    query = `
      WITH teacher_stats AS (
        SELECT
          u.id AS teacher_id,
          u.name,
          c.name AS course_name,
          CASE 
           WHEN tc.class_type = 'extra' THEN 'Extra Class'
           WHEN tc.class_type = 'fixed' THEN 'Fixed'
           WHEN tc.class_type = 'per_class' THEN 'Per Class'
           ELSE 'Workshop'
          END AS class_type,
          COUNT(DISTINCT tc.class_date) AS number_worked_days,
          (
            SELECT
             CASE 
              WHEN tc.class_type = 'fixed' AND ess.class_per_month IS NOT NULL
                THEN ess.amount::INT || ' / ' || ess.class_per_month || ' = ' || (ess.amount / ess.class_per_month)::INT
              ELSE ess.amount::INT::TEXT
             END
            FROM employee_salary_structure ess
            WHERE ess.employee_id = u.id
              AND ess.salary_type = tc.class_type
              AND ess.course_id = c.id
          ) AS rate_per_date_text,
          SUM(tc.daily_earning) AS earning,
          SUM(tc.units) AS total_classes_taken
        FROM users u
        JOIN teacher_classes tc ON tc.teacher_id = u.id AND date_trunc('month', tc.class_date) = date_trunc('month', $1::DATE)
        LEFT JOIN course c ON c.id = tc.course_id
        WHERE u.category = 'Teacher'
        GROUP BY u.id, u.name, c.id, c.name, tc.class_type
      ),
      course_grouped AS (
        SELECT
          teacher_id,
          name,
          course_name,
          json_agg(
            json_build_object(
              'class_type', class_type,
              'number_worked_days', number_worked_days,
              'rate_per_date_text', rate_per_date_text,
              'earning', earning,
              'total_classes_taken', total_classes_taken
            ) ORDER BY class_type
          ) AS rows,
          SUM(earning) AS course_total
        FROM teacher_stats
        GROUP BY teacher_id, name, course_name
      )
      SELECT
        teacher_id,
        name AS "teacherName",
        json_agg(
          json_build_object(
            'courseName', course_name,
            'rows', rows,
            'courseTotal', course_total
          ) ORDER BY course_name
        ) AS courses,
        SUM(course_total) AS "teacherTotal"
      FROM course_grouped
      GROUP BY teacher_id, name;
  `;
  }

  const client = await pool.connect();
  try {
    const pgStream = client.query(
      new QueryStream(query, [monthStart], { batchSize: 10 })
    );

    pgStream.on("data", (data) => {
      pgStream.pause();

      if (employeetype === "Staff") {
        const salaryComponents = data.salary_components;
        const sundayWorked = data.sunday_worked || 0;
        const absentDays = data.absent_days || 0;

        let gross = 0;
        let deduction = 0;

        salaryComponents.forEach((comp: any) => {
          if (comp.amount_type === "addition") gross += comp.amount;
          else if (comp.amount_type === "deduction") deduction += comp.amount;
        });

        // const perDayRate = Math.floor(gross / 30); // adjust if 30 days
        const perDayRate = gross / 30;

        // gross += sundayWorked * perDayRate;
        const netPay = gross - sundayWorked * perDayRate - deduction;
        const sundayPayTxt =
          sundayWorked == 0 ? 0 : `${sundayWorked} x ${perDayRate}`;

        const startRow = rowIndex;
        const endRow = rowIndex + salaryComponents.length - 1;

        // Add each component row
        salaryComponents.forEach((comp: any, i: number) => {
          const row = worksheet.addRow([
            i === 0 ? data.name : null, // Name only once
            i === 0 ? data.present_days : null,
            i === 0 ? absentDays : null,
            i === 0 ? data.leave_days : null,
            i === 0 ? data.holiday_count : null,
            i === 0 ? data.total_sundays_in_month : null,
            comp.salary_type,
            comp.amount,
            i === 0 ? sundayPayTxt : null,
            i === 0 ? perDayRate.toFixed(2) : null,
            i === 0 ? gross : null,
            i === 0 ? (deduction + absentDays * perDayRate).toFixed(2) : null,
            i === 0 ? (netPay - absentDays * perDayRate).toFixed(2) : null,
            null,
          ]);

          row.height = 20;
          row.eachCell((cell) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            cell.alignment = { vertical: "middle", horizontal: "center" };
          });

          rowIndex++;
        });

        // Merge cells like in StuffSalary.xlsx
        if (salaryComponents.length > 1) {
          worksheet.mergeCells(`A${startRow}:A${endRow}`); // Name
          worksheet.mergeCells(`B${startRow}:B${endRow}`); // Present
          worksheet.mergeCells(`C${startRow}:C${endRow}`); // Absent
          worksheet.mergeCells(`D${startRow}:D${endRow}`); // Leave
          worksheet.mergeCells(`E${startRow}:E${endRow}`); // Holiday
          worksheet.mergeCells(`F${startRow}:F${endRow}`); // TOTAL SUNDAY
          // worksheet.mergeCells(`G${startRow}:G${endRow}`); // Sunday
          // worksheet.mergeCells(`H${startRow}:H${endRow}`); // Per Day Rate
          worksheet.mergeCells(`I${startRow}:I${endRow}`); // Gross Amount
          worksheet.mergeCells(`J${startRow}:J${endRow}`); // Deduction
          worksheet.mergeCells(`K${startRow}:K${endRow}`); // Net Amount
          worksheet.mergeCells(`L${startRow}:L${endRow}`);
          worksheet.mergeCells(`M${startRow}:M${endRow}`);
          worksheet.mergeCells(`N${startRow}:N${endRow}`);
        }
      } else if (employeetype === "Teacher") {
        // Add teacher name in the first column, spanning multiple rows
        const teacherStartRow = rowIndex;

        // Process each course for this teacher
        let teacherRowCount = 0;

        data.courses.forEach((course: any) => {
          // Add course name row
          // const courseStartRow = rowIndex;

          course.rows.forEach((classData: any, index: number) => {
            const row = worksheet.addRow([
              index === 0 && teacherRowCount === 0 ? data.teacherName : "", // Teacher name only on first row
              index === 0 ? course.courseName : "", // Course name only on first row of course
              classData.class_type,
              // classData.number_worked_days,
              classData.rate_per_date_text,
              classData.total_classes_taken,
              classData.earning,
              data.teacherTotal && teacherRowCount === 0 && index === 0
                ? data.teacherTotal
                : "", // Teacher total only on very first row
              "", // Sign column - empty for now
            ]);

            // Apply styling
            row.height = 20;

            // Style the row
            row.eachCell((cell, colNumber) => {
              cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
              };
              cell.alignment = { vertical: "middle", horizontal: "center" };
            });

            rowIndex++;
            teacherRowCount++;
          });
        });

        // Merge teacher name cells if there are multiple rows for this teacher
        if (teacherRowCount > 1) {
          worksheet.mergeCells(`A${teacherStartRow}:A${rowIndex - 1}`);
        }

        // Merge course name cells and course total cells for each course
        let currentRow = teacherStartRow;
        data.courses.forEach((course: any) => {
          const courseRowCount = course.rows.length;
          if (courseRowCount > 1) {
            worksheet.mergeCells(
              `B${currentRow}:B${currentRow + courseRowCount - 1}`
            );
          }
          currentRow += courseRowCount;
        });

        // Merge teacher total cell (Grand Total column - column G AND H THE SING)
        if (teacherRowCount > 1) {
          // worksheet.mergeCells(`D${teacherStartRow}:D${rowIndex - 1}`);
          worksheet.mergeCells(`G${teacherStartRow}:G${rowIndex - 1}`);
          worksheet.mergeCells(`H${teacherStartRow}:H${rowIndex - 1}`);
        }
      }

      pgStream.resume();
    });

    pgStream.on("end", async () => {
      try {
        await workbook.commit();
      } finally {
        client.release();
      }
    });

    pgStream.on("error", (err) => {
      console.error("Stream error:", err.message);

      // Cleanup
      client.release();

      // Destroy response so client knows download failed
      if (!res.headersSent) {
        // If no data was written yet, you could send a proper error response
        res.status(500).json(new ApiResponse(500, err.message));
      } else {
        // If file already started streaming, just destroy the connection
        res.destroy(err);
      }
    });
  } catch (err: any) {
    client.release();
    throw new ErrorHandler(400, err.message);
  }
});

// export const createInventoryReport = asyncErrorHandler(async (req, res) => {
//   const { error, value } = VInventoryReport.validate(req.query ?? {});
//   if (error) throw new ErrorHandler(400, error.message);

//   // Set response headers for streaming
//   res.setHeader(
//     "Content-Disposition",
//     'attachment; filename="Inventory_Report.xlsx"'
//   );
//   res.setHeader(
//     "Content-Type",
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//   );

//   const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
//     stream: res,
//     useStyles: true,
//   });
//   const worksheet = workbook.addWorksheet("Inventory Report");

//   worksheet.mergeCells("A1:N1");
//   worksheet.getCell(
//     "A1"
//   ).value = `Inventory Report (${value.from_date} - ${value.to_date})`;
//   worksheet.getCell("A1").font = {
//     size: 20,
//     bold: true,
//     color: { argb: "000000" },
//   };
//   worksheet.getCell("A1").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFF00" },
//   };
//   worksheet.getRow(1).height = 30;
//   worksheet.getCell("A1").alignment = {
//     horizontal: "center",
//     vertical: "middle",
//   };

//   worksheet.addRow([
//     "SR NUMBER",
//     "NAME OF ITEM",
//     "VENDOR",
//     "OPENING STOCK",
//     "MINIMUM QUANTITY TO MAINTAIN",
//     "ITEM CONSUMED",
//     "STOCK ADDED",
//     "CLOSING STOCK",
//     "LAST PURCHASED DATE",
//     "COST PER UNIT (CURRENT COST)",
//     "COST PER UNIT (PREVIOUS COST)",
//     "TOTAL VALUE",
//     "REMARKS",
//     "DATE",
//   ]);

//   // Row styling (header row)
//   worksheet.getRow(2).eachCell((cell) => {
//     cell.style = {
//       font: {
//         bold: true,
//         size: 12,
//         color: { argb: "000000" },
//       },
//       alignment: { horizontal: "center", vertical: "middle" },
//       fill: {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "F4A460" },
//       },
//       border: {
//         top: { style: "thin" },
//         left: { style: "thin" },
//         right: { style: "thin" },
//         bottom: { style: "thin" },
//       },
//     };
//   });

//   const client = await pool.connect();
//   const query = new QueryStream(
//     `
//      WITH
//       -- Step 1: Get the earliest transaction date (or default to $1)
//       min_required_date AS (
//         SELECT MIN(transaction_date) AS min_date
//         FROM inventory_transactions
//         WHERE transaction_date <= $2
//       ),

//       -- Step 2: Generate full date series from earliest available transaction date or $1
//       date_range AS (
//         SELECT generate_series(
//           LEAST(COALESCE((SELECT min_date FROM min_required_date), $1), $1),
//           $2,
//           INTERVAL '1 day'
//         )::DATE AS report_date
//       ),

//       -- Step 3: Pair every item with every date
//       inventory_dates AS (
//         SELECT i.item_id, i.item_name, i.where_to_use, i.used_by, i.description, i.minimum_quantity, i.vendor_id, d.report_date
//         FROM inventory_items i
//         CROSS JOIN date_range d

//         WHERE d.report_date >= i.created_at::date
//       ),

//       -- Step 4: Sum of transactions per item per day
//       transactions_grouped AS (
//         SELECT
//           tg.item_id,
//           tg.transaction_date,
//           tg.total_cost_per_unit,
//           tg.total_added,
//           tg.total_consumed,
//           -- ls.quantity_status,
//           ls.remark,
//           tg.total_value
//         FROM (
//           SELECT
//             item_id,
//             transaction_date,
//             SUM(cost_per_unit) AS total_cost_per_unit,
//             SUM(CASE WHEN transaction_type = 'add' THEN quantity ELSE 0 END) AS total_added,
//             SUM(CASE WHEN transaction_type = 'consume' THEN quantity ELSE 0 END) AS total_consumed,
//             SUM(total_value) AS total_value
//           FROM inventory_transactions
//           GROUP BY item_id, transaction_date
//         ) tg
//         LEFT JOIN LATERAL (
//           SELECT quantity_status, remark
//           FROM inventory_transactions t
//           WHERE t.item_id = tg.item_id AND t.transaction_date = tg.transaction_date AND transaction_type = 'add'
//           ORDER BY t.inventory_transaction_id DESC  -- or created_at DESC if available
//           LIMIT 1
//         ) ls ON TRUE
//       ),

//       -- Step 5: Merge items and their daily transactions
//       daily_stock_data AS (
//         SELECT
//           idr.item_id,
//           idr.item_name,
//           -- idr.where_to_use,
//           -- idr.used_by,
//           -- idr.description,
//           idr.minimum_quantity,
//           idr.vendor_id,
//           idr.report_date,
//           -- tg.quantity_status,
//           tg.remark,
//           COALESCE(tg.total_added, 0) AS added,
//           COALESCE(tg.total_consumed, 0) AS consumed,
//           COALESCE(tg.total_cost_per_unit, 0) AS cost_per_unit_current,
//           COALESCE(tg.total_value, 0) AS total_value,
//           ltd.last_transaction_date
//         FROM inventory_dates idr

//         LEFT JOIN transactions_grouped tg
//           ON idr.item_id = tg.item_id AND idr.report_date = tg.transaction_date

//         LEFT JOIN LATERAL (
//           SELECT transaction_date AS last_transaction_date
//           FROM inventory_transactions t
//           WHERE t.item_id = idr.item_id AND t.transaction_date <= idr.report_date AND t.transaction_type = 'add'
//           ORDER BY t.transaction_date DESC, t.inventory_transaction_id DESC
//           LIMIT 1
//         ) ltd ON TRUE

//       ),

//       -- Step 6: Rolling stock calculation
//       cumulative_stock AS (
//         SELECT
//           dsd.*,
//           LAG(cost_per_unit_current, 1, 0) OVER (
//             PARTITION BY dsd.item_id
//             ORDER BY dsd.report_date
//           ) AS cost_per_unit_prev,
//           SUM(added - consumed) OVER (
//             PARTITION BY dsd.item_id
//             ORDER BY dsd.report_date
//             ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
//           ) AS opening_stock
//         FROM daily_stock_data AS dsd
//       )

//       -- Step 7: Show final report within user-selected date range
//       SELECT
//         row_number() OVER (
//           PARTITION BY report_date
//           ORDER BY item_id ASC
//         ) AS sr_no,
//         item_name,
//         v.name AS vendor_name,
//         COALESCE(opening_stock, 0) AS opening_stock,
//         minimum_quantity,
//         consumed,
//         added,
//         COALESCE(opening_stock, 0) + added - consumed AS closing_stock,
//         TO_CHAR(last_transaction_date, 'FMDD FMMonth, YYYY') AS last_transaction_date,
//         cost_per_unit_current,
//         COALESCE(cost_per_unit_prev, 0) AS cost_per_unit_prev,
//         total_value,
//         remark,
//         TO_CHAR(report_date, 'YYYY-MM-DD') AS report_date
//       FROM cumulative_stock

//       LEFT JOIN vendor v
//       ON v.id = cumulative_stock.vendor_id

//       WHERE report_date BETWEEN $1 AND $2
//       ORDER BY item_id, report_date;
//       `,
//     [value.from_date, value.to_date],
//     {
//       batchSize: 10,
//     }
//   );

//   const pgStream = client.query(query);

//   const dates = new Map();

//   // Process PostgreSQL stream data and append to Excel sheet
//   pgStream.on("data", (data) => {
//     pgStream.pause();
//     const valueArr = Object.values(data);

//     // const newRowOfDate
//     if (!dates.has(`${data.report_date}`)) {
//       const dateRow = worksheet.addRow([
//         "",
//         `DATE : ${data.report_date}`,
//       ]);
//       worksheet.mergeCells(`A${dateRow.number}:A${dateRow.number}`);
//       worksheet.mergeCells(`B${dateRow.number}:N${dateRow.number}`);
//       worksheet.getCell(`B${dateRow.number}`).alignment = {
//         vertical: "justify",
//         horizontal: "center",
//       };
//       dateRow.eachCell((cell) => {
//         cell.style = {
//           font: {
//             size: 12,
//             color: {
//               argb: "000000",
//             },
//             bold: true,
//           },
//           alignment: { horizontal: "left" },
//           fill: {
//             type: "pattern",
//             pattern: "solid",
//             fgColor: { argb: "72BF6A" },
//           },
//         };
//       });
//       dates.set(`${data.report_date}`, "true");
//     }

//     const excelRow = worksheet.addRow(valueArr);

//     // Style the data rows
//     excelRow.eachCell((cell) => {
//       cell.style = {
//         font: { size: 11 },
//         alignment: { horizontal: "center" },
//         border: {
//           top: { style: "thin" },
//           left: { style: "thin" },
//           right: { style: "thin" },
//           bottom: { style: "thin" },
//         },
//       };
//     });

//     pgStream.resume();
//   });

//   pgStream.on("end", () => {
//     workbook.commit();
//     client.release(); // Release the client when done
//   });

//   pgStream.on("error", (err) => {
//     client.release();
//     console.log(err);
//   });
// })

// export const createInventoryReport = asyncErrorHandler(async (req, res) => {

//   // 1. Set headers
//   res.setHeader(
//     "Content-Disposition",
//     `attachment; filename="Inventory_Report_Sheet.xlsx"`
//   );
//   res.setHeader(
//     "Content-Type",
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//   );

//   // 2. Create streaming workbook
//   const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
//     stream: res,
//     useStyles: true,
//   });
//   const worksheet = workbook.addWorksheet("Employee Salary");

//   worksheet.getCell("A1").value = `Payment Sheet For The Month Of ${formatted}`;
//   worksheet.getCell("A1").font = {
//     size: 20,
//     bold: true,
//     color: { argb: "000000" },
//   };
//   worksheet.getCell("A1").fill = {
//     type: "pattern",
//     pattern: "solid",
//     fgColor: { argb: "FFFF00" },
//   };
//   worksheet.getRow(1).height = 30;
//   worksheet.getCell("A1").alignment = {
//     horizontal: "center",
//     vertical: "middle",
//   };

//   worksheet.addRow([
//       "Name",
//       "Present",
//       "Absent",
//       "Leave",
//       "Holiday",
//       "Payment Components",
//       null,
//       "Sunday",
//       "Per Day Rate",
//       "Gross Amount",
//       "Deduction",
//       "Net Payable Amount",
//       "Signature",
//     ]);

//   // Row styling (header row)
//   worksheet.getRow(2).eachCell((cell) => {
//     cell.style = {
//       font: { bold: true, size: 14, color: { argb: "000000" } },
//       alignment: { horizontal: "center", vertical: "middle" },
//       fill: {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "F4A460" },
//       }, // Red background
//       border: {
//         top: { style: "thin" },
//         left: { style: "thin" },
//         right: { style: "thin" },
//         bottom: { style: "thin" },
//       },
//     };
//   });

//   if (employeetype === "Staff") {
//     // Merge header "Payment Component" across B1:C1
//     worksheet.mergeCells("F2:G2");
//   }

//   let rowIndex = 3;

//   // 4. SQL query for salary + attendance
//   const query = ``;

//   const client = await pool.connect();
//   try {
//     const pgStream = client.query(new QueryStream(query, [monthStart], { batchSize: 10 }));

//     pgStream.on("data", (data) => {
//       pgStream.pause();

//       if (employeetype === "Staff") {
//         const salaryComponents = data.salary_components;
//         const sundayWorked = data.sunday_worked || 0;
//         const absentDays = data.absent_days || 0;

//         let gross = 0;
//         let deduction = 0;

//         salaryComponents.forEach((comp: any) => {
//           if (comp.amount_type === "addition") gross += comp.amount;
//           else if (comp.amount_type === "deduction") deduction += comp.amount;
//         });

//         // const perDayRate = Math.floor(gross / 30); // adjust if 30 days
//         const perDayRate = gross / 30;

//         // gross += sundayWorked * perDayRate;
//         const netPay = gross - (sundayWorked * perDayRate) - deduction;
//         const sundayPayTxt =
//           sundayWorked == 0 ? 0 : `${sundayWorked} x ${perDayRate}`;

//         const startRow = rowIndex;
//         const endRow = rowIndex + salaryComponents.length - 1;

//         // Add each component row
//         salaryComponents.forEach((comp: any, i: number) => {
//           const row = worksheet.addRow([
//             i === 0 ? data.name : null, // Name only once
//             i === 0 ? data.present_days : null,
//             i === 0 ? absentDays : null,
//             i === 0 ? data.leave_days : null,
//             i === 0 ? data.holiday_count : null,
//             comp.salary_type,
//             comp.amount,
//             i === 0 ? sundayPayTxt : null,
//             i === 0 ? perDayRate.toFixed(2) : null,
//             i === 0 ? gross : null,
//             i === 0 ? (deduction + (absentDays * perDayRate)).toFixed(2) : null,
//             i === 0 ? (netPay - (absentDays * perDayRate)).toFixed(2) : null,
//             null,
//           ]);

//           row.height = 20;
//           row.eachCell((cell) => {
//             cell.border = {
//               top: { style: "thin" },
//               left: { style: "thin" },
//               bottom: { style: "thin" },
//               right: { style: "thin" },
//             };
//             cell.alignment = { vertical: "middle", horizontal: "center" };
//           });

//           rowIndex++;
//         });

//         // Merge cells like in StuffSalary.xlsx
//         if (salaryComponents.length > 1) {
//           worksheet.mergeCells(`A${startRow}:A${endRow}`); // Name
//           worksheet.mergeCells(`B${startRow}:B${endRow}`); // Present
//           worksheet.mergeCells(`C${startRow}:C${endRow}`); // Absent
//           worksheet.mergeCells(`D${startRow}:D${endRow}`); // Leave
//           worksheet.mergeCells(`E${startRow}:E${endRow}`); // Holiday
//           worksheet.mergeCells(`G${startRow}:G${endRow}`); // Sunday
//           worksheet.mergeCells(`H${startRow}:H${endRow}`); // Per Day Rate
//           worksheet.mergeCells(`I${startRow}:I${endRow}`); // Gross Amount
//           worksheet.mergeCells(`J${startRow}:J${endRow}`); // Deduction
//           worksheet.mergeCells(`K${startRow}:K${endRow}`); // Net Amount
//           worksheet.mergeCells(`L${startRow}:L${endRow}`); // Sign
//         }
//       } else if (employeetype === "Teacher") {
//         // Add teacher name in the first column, spanning multiple rows
//         const teacherStartRow = rowIndex;

//         // Process each course for this teacher
//         let teacherRowCount = 0;

//         data.courses.forEach((course: any) => {
//           // Add course name row
//           // const courseStartRow = rowIndex;

//           course.rows.forEach((classData: any, index: number) => {
//             const row = worksheet.addRow([
//               index === 0 && teacherRowCount === 0 ? data.teacherName : "", // Teacher name only on first row
//               index === 0 ? course.courseName : "", // Course name only on first row of course
//               classData.class_type,
//               // classData.number_worked_days,
//               classData.rate_per_date_text,
//               classData.total_classes_taken,
//               classData.earning,
//               data.teacherTotal && teacherRowCount === 0 && index === 0
//                 ? data.teacherTotal
//                 : "", // Teacher total only on very first row
//               "", // Sign column - empty for now
//             ]);

//             // Apply styling
//             row.height = 20;

//             // Style the row
//             row.eachCell((cell, colNumber) => {
//               cell.border = {
//                 top: { style: "thin" },
//                 left: { style: "thin" },
//                 bottom: { style: "thin" },
//                 right: { style: "thin" },
//               };
//               cell.alignment = { vertical: "middle", horizontal: "center" };
//             });

//             rowIndex++;
//             teacherRowCount++;
//           });
//         });

//         // Merge teacher name cells if there are multiple rows for this teacher
//         if (teacherRowCount > 1) {
//           worksheet.mergeCells(`A${teacherStartRow}:A${rowIndex - 1}`);
//         }

//         // Merge course name cells and course total cells for each course
//         let currentRow = teacherStartRow;
//         data.courses.forEach((course: any) => {
//           const courseRowCount = course.rows.length;
//           if (courseRowCount > 1) {
//             worksheet.mergeCells(
//               `B${currentRow}:B${currentRow + courseRowCount - 1}`
//             );
//           }
//           currentRow += courseRowCount;
//         });

//         // Merge teacher total cell (Grand Total column - column G AND H THE SING)
//         if (teacherRowCount > 1) {
//           // worksheet.mergeCells(`D${teacherStartRow}:D${rowIndex - 1}`);
//           worksheet.mergeCells(`G${teacherStartRow}:G${rowIndex - 1}`);
//           worksheet.mergeCells(`H${teacherStartRow}:H${rowIndex - 1}`);
//         }
//       }

//       pgStream.resume();
//     });

//     pgStream.on("end", async () => {
//       try {
//         await workbook.commit();
//       } finally {
//         client.release();
//       }
//     });

//     pgStream.on("error", (err) => {
//       console.error("Stream error:", err.message);

//       // Cleanup
//       client.release();

//       // Destroy response so client knows download failed
//       if (!res.headersSent) {
//         // If no data was written yet, you could send a proper error response
//         res.status(500).json(new ApiResponse(500, err.message))
//       } else {
//         // If file already started streaming, just destroy the connection
//         res.destroy(err);
//       }
//     });
//   } catch (err: any) {
//     client.release();
//     throw new ErrorHandler(400, err.message)
//   }

// })

export const createInventoryReport = asyncErrorHandler(async (req, res) => {
  const { error, value } = VInventoryReport.validate(req.query ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  res.setHeader(
    "Content-Disposition",
    'attachment; filename="Inventory_Report.xlsx"'
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: res,
    useStyles: true,
  });
  const worksheet = workbook.addWorksheet("Inventory Report");

  worksheet.mergeCells("A1:I1");
  worksheet.getCell(
    "A1"
  ).value = `Inventory Report (${value.from_date} - ${value.to_date})`;
  worksheet.getCell("A1").font = {
    size: 20,
    bold: true,
    color: { argb: "000000" },
  };
  worksheet.getCell("A1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFF00" },
  };
  worksheet.getRow(1).height = 30;
  worksheet.getCell("A1").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.addRow([
    "SR NUMBER",
    "NAME OF ITEM",
    "VENDOR",
    "LAST PURCHASED DATE",
    "STOCK IN TOTAL RS",
    "STOCK OUT TOTAL RS",
    "MINIMUM QUANTITY TO MAINTAIN",
    "AVILABLE QUANTITY",
    "CONSUME QUANTITY",
  ]);

  // Row styling (header row)
  worksheet.getRow(2).eachCell((cell) => {
    cell.style = {
      font: {
        bold: true,
        size: 12,
        color: { argb: "000000" },
      },
      alignment: { horizontal: "center", vertical: "middle" },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "F4A460" },
      },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        bottom: { style: "thin" },
      },
    };
  });

  const client = await pool.connect();
  const query = new QueryStream(
    `
      SELECT
        row_number() OVER () AS sr_no,
        ii.item_name,
        v.name AS vendor_name,
        TO_CHAR(MAX(it.transaction_date), 'FMDD FMMonth, YYYY') AS last_transaction_date,
        COALESCE(SUM(it.cost_per_unit * it.quantity) FILTER (WHERE it.transaction_type = 'add'), 0.00) AS total_expense,
        COALESCE(SUM(it.cost_per_unit * it.quantity) FILTER (WHERE it.transaction_type = 'consume'), 0.00) AS total_income,
        ii.minimum_quantity,
        COALESCE(SUM(it.quantity) FILTER (WHERE it.transaction_type = 'add'), 0) - COALESCE(SUM(it.quantity) FILTER (WHERE it.transaction_type = 'consume'), 0) AS avilable_quantity,
        COALESCE(SUM(it.quantity) FILTER (WHERE it.transaction_type = 'consume'), 0) AS consume_quantity
      FROM inventory_items_v2 ii

      LEFT JOIN inventory_transactions_v2 it
      ON it.item_id = ii.id

      LEFT JOIN vendor v
      ON v.id = it.vendor_id

      WHERE it.transaction_date BETWEEN $1 AND $2

      GROUP BY v.id, it.vendor_id, ii.id

      ORDER BY ii.id DESC
      `,
    [value.from_date, value.to_date],
    {
      batchSize: 10,
    }
  );

  const pgStream = client.query(query);

  // Process PostgreSQL stream data and append to Excel sheet
  pgStream.on("data", (data) => {
    pgStream.pause();

    const excelRow = worksheet.addRow(Object.values(data));

    // Style the data rows
    excelRow.eachCell((cell) => {
      cell.style = {
        font: { size: 11 },
        alignment: { horizontal: "center" },
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
          bottom: { style: "thin" },
        },
      };
    });

    pgStream.resume();
  });

  pgStream.on("end", () => {
    workbook.commit();
    client.release(); // Release the client when done
  });

  pgStream.on("error", () => {
    client.release();
    res.destroy();
  });
});

// monthly payment report
export const monthlyPaymentReport = asyncErrorHandler(async (req, res) => {
  const { error, value } = VMonthlyPaymentReport.validate(req.query ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  // Set response headers for streaming
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="Monthly_Payment_Report.xlsx"'
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  let filter = "";
  const filterValues: string[] = [];
  let placeholder = 1;

  if (value.from_date && value.to_date) {
    if (filter == "") {
      filter = `WHERE ff.created_at BETWEEN $${placeholder++}::date AND $${placeholder++}::date`;
    } else {
      filter += ` AND ff.created_at BETWEEN $${placeholder++}::date AND $${placeholder++}::date`;
    }
    filterValues.push(value.from_date);
    filterValues.push(value.to_date);
  }

  if (value.course) {
    if (filter == "") {
      filter = `WHERE c.id = $${placeholder++}`;
    } else {
      filter += ` AND c.id = $${placeholder++}`;
    }
    filterValues.push(value.course);
  }

  if (value.batch) {
    if (filter == "") {
      filter = `WHERE b.id = $${placeholder++}`;
    } else {
      filter += ` AND b.id = $${placeholder++}`;
    }
    filterValues.push(value.batch);
  }

  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: res,
    useStyles: true,
  });
  const worksheet = workbook.addWorksheet("Monthly Payment Report");

  // worksheet.mergeCells("A1:H1");
  // worksheet.getCell("A1").value = `Admission Report (${rows[0].name}) (${value.from_date} - ${value.to_date})`;
  worksheet.getCell("A1").font = {
    size: 20,
    bold: true,
    color: { argb: "000000" },
  };
  worksheet.getCell("A1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFF00" },
  };
  worksheet.getRow(1).height = 30;
  worksheet.getCell("A1").alignment = {
    horizontal: "left",
    vertical: "middle",
  };

  const rowArray = [
    "Sr Number",
    "Student Name",
    "Date Of Admission",
    "Session",
    "Monthly Fees per Month",
    "Total Months paid",
  ];

  worksheet.addRow(rowArray);

  // Row styling (header row)
  const ROWS = [worksheet.getRow(2)];
  ROWS.forEach((item) => {
    item.eachCell((cell) => {
      cell.style = {
        font: { bold: true, size: 14, color: { argb: "000000" } },
        alignment: { horizontal: "center", vertical: "middle" },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F4A460" },
        }, // Red background
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
          bottom: { style: "thin" },
        },
      };
    });
  });

  const client = await pool.connect();
  const query = new QueryStream(
    `
      WITH month_series AS (
          SELECT generate_series(
                    DATE_TRUNC('month', $1::date),     -- from_date
                    DATE_TRUNC('month', $2::date),     -- to_date
                    interval '1 month'
                )::date AS month_date
      ),
      monthly_payment_calcluction AS (
          SELECT
              p.form_id,
              DATE_TRUNC('month', p.month)::date AS month_date,
              SUM(p.amount) AS sum_monthly_amount,
              STRING_AGG(DISTINCT(p.bill_no), ' + ') AS bill_number,
              STRING_AGG(DISTINCT(p.payment_date)::text, ' + ') AS payment_date
          FROM payments p
          WHERE p.fee_head_id = 4
          GROUP BY p.form_id, DATE_TRUNC('month', p.month)
      ),
      final_months AS (
          SELECT
              row_number() OVER () AS temp_id,
              ff.id AS form_id,
              ms.month_date,
              COALESCE(mpc.sum_monthly_amount, 0) AS sum_monthly_amount,
              mpc.payment_date AS payment_dates,
              mpc.bill_number AS bill_numbers
          FROM fillup_forms ff
          CROSS JOIN month_series ms
          LEFT JOIN monthly_payment_calcluction mpc
                ON mpc.form_id = ff.id AND ms.month_date = mpc.month_date
      )
      SELECT
          row_number() OVER () AS sr_no,
          u.name,
          c.name AS course_name,
          b.month_name AS batch_name,
          TO_CHAR(ff.created_at, 'DD FMMonth YYYY') AS created_at,
          s.name AS session_name,
          ROUND(
              MAX(ffs.amount / c.duration)::numeric, 
              2
          ) AS monthly_fee,
          c.duration AS month_duration,
          COALESCE(
              JSON_AGG(
                  json_build_object(
                      'temp_id', fm.temp_id,
                      'month', TO_CHAR(fm.month_date, 'Mon, YYYY'),
                      'amount', fm.sum_monthly_amount,
                      'payment_dates', fm.payment_dates,
                      'bill_numbers', fm.bill_numbers
                  ) ORDER BY fm.month_date
              ) FILTER (WHERE fm.form_id IS NOT NULL),
              '[]'::json
          ) AS monthly_payment_summery,

      COUNT(fm.month_date) FILTER(WHERE fm.sum_monthly_amount != 0) AS total_month_paid
      FROM fillup_forms ff
      LEFT JOIN users u ON u.id = ff.student_id
      LEFT JOIN enrolled_courses ec ON ec.form_id = ff.id
      LEFT JOIN session s ON s.id = ec.session_id
      LEFT JOIN course c ON c.id = ec.course_id
      LEFT JOIN batch b ON b.id = ec.batch_id
      LEFT JOIN form_fee_structure ffs 
            ON ffs.form_id = ff.id AND ffs.fee_head_id = 4
      LEFT JOIN final_months fm ON fm.form_id = ff.id
      ${filter}
      GROUP BY u.id, c.id, ff.id, s.id, b.id;
    `,
    filterValues,
    {
      batchSize: 10,
    }
  );

  const pgStream = client.query(query);

  let index = 0;
  const created_fee_head_column_info: {
    colname: string;
    array_index: number;
    type: "fee_head" | "bill_no_date";
  }[] = [];

  pgStream.on("data", (data) => {
    pgStream.pause();

    if (index === 0) {
      worksheet.getCell(
        "A1"
      ).value = `Monthly Payment Report (${data.course_name}) (${data.batch_name}) (${value.from_date} - ${value.to_date})`;

      const ROW_NUMBER = 2;
      let currentCol = 7; // Start at column H (9th col)

      data.monthly_payment_summery.forEach((item: any, index: number) => {
        const colName1 = getExcelColumnName(currentCol);
        const cell1 = worksheet.getCell(`${colName1}${ROW_NUMBER}`);

        cell1.style = {
          font: { bold: true, size: 14, color: { argb: "000000" } },
          alignment: { horizontal: "center", vertical: "middle" },
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "87CEEB" },
          },
          border: {
            top: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" },
          },
        };

        cell1.value = item.month;

        created_fee_head_column_info.push({
          array_index: index,
          colname: colName1,
          type: "fee_head",
        });

        const colName2 = getExcelColumnName(currentCol + 1);
        const cell2 = worksheet.getCell(`${colName2}${ROW_NUMBER}`);

        cell2.style = {
          font: { bold: true, size: 14, color: { argb: "000000" } },
          alignment: { horizontal: "center", vertical: "middle" },
          border: {
            top: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" },
          },
        };

        created_fee_head_column_info.push({
          array_index: index,
          colname: colName2,
          type: "bill_no_date",
        });

        cell2.value = "Bill No & Date";

        currentCol += 2;
      });

      // Marge the heading
      worksheet.mergeCells(1, 1, 1, currentCol - 1);

      index++;
    }

    const excelRow = worksheet.addRow([
      data.sr_no,
      data.name,
      data.created_at,
      data.session_name,
      data.monthly_fee,
      data.total_month_paid,
    ]);

    created_fee_head_column_info.forEach((item) => {
      const monthly_payment_summery =
        data.monthly_payment_summery[item.array_index];
      const cell = worksheet.getCell(`${item.colname}${excelRow.number}`);

      if (monthly_payment_summery) {
        if (item.type === "fee_head") {
          cell.value = monthly_payment_summery.amount;
        } else if (item.type === "bill_no_date") {
          let valueToStore = "";
          if (monthly_payment_summery.bill_numbers != null) {
            valueToStore += `Bill No : ${monthly_payment_summery.bill_numbers}, `;
          }

          if (monthly_payment_summery.payment_dates != null) {
            valueToStore += `DT No : ${monthly_payment_summery.payment_dates}`;
          }

          if (
            monthly_payment_summery.payment_date == null &&
            monthly_payment_summery.bill_numbers == null
          ) {
            valueToStore = "-";
          }
          cell.value = valueToStore;
        }
      } else {
        cell.value = "-";
      }
    });

    // Style the data rows
    excelRow.eachCell((cell) => {
      cell.style = {
        font: {
          size: 12,
        },
        alignment: { horizontal: "center" },
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
          bottom: { style: "thin" },
        },
      };
    });

    pgStream.resume();
  });

  pgStream.on("end", () => {
    workbook.commit();
    client.release(); // Release the client when done
  });

  pgStream.on("error", (err) => {
    client.release();
    workbook.commit();
    console.log(err);
    // throw new ErrorHandler(500, err.message);
  });
});

// Summary Report for Student Current Fees Status
export const studetnFeeSummaryReport = asyncErrorHandler(async (req, res) => {
  // Set response headers for streaming
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="Fee_Summary_Report.xlsx"'
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: res,
    useStyles: true,
  });
  const worksheet = workbook.addWorksheet("Fee Summart Report");

  worksheet.getCell("A1").font = {
    size: 20,
    bold: true,
    color: { argb: "000000" },
  };
  worksheet.getCell("A1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFF00" },
  };
  worksheet.getRow(1).height = 30;
  worksheet.getCell("A1").alignment = {
    horizontal: "left",
    vertical: "middle",
  };

  const rowArray = [
    "Sr Number",
    "Student Name",
    "Form ID",
    "Course",
    "Batch",
    "Session",
    "Duration"
  ];

  worksheet.addRow(rowArray);

  worksheet.mergeCells("A2:A3");
  worksheet.mergeCells("B2:B3");
  worksheet.mergeCells("C2:C3");
  worksheet.mergeCells("D2:D3");
  worksheet.mergeCells("E2:E3");
  worksheet.mergeCells("F2:F3");
  worksheet.mergeCells("G2:G3");

  // Row styling (header row)
  const ROWS = [worksheet.getRow(2), worksheet.getRow(3)];
  ROWS.forEach((item) => {
    item.eachCell((cell) => {
      cell.style = {
        font: { bold: true, size: 14, color: { argb: "000000" } },
        alignment: { horizontal: "center", vertical: "middle" },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F4A460" },
        }, // Red background
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
          bottom: { style: "thin" },
        },
      };
    });
  });

  const client = await pool.connect();
  const query = new QueryStream(`
    SELECT
      row_number() OVER () AS sr_no,
      u.name AS student_name,
      ff.form_name,
      c.name AS course_name,
      b.month_name AS batch_name,
      s.name AS session_name,
      c.duration AS month_duration,
      JSON_AGG(effi) FILTER (WHERE effi.form_id IS NOT NULL) AS fee_info,
      (SELECT JSON_AGG(JSON_BUILD_OBJECT('id', id, 'name', name) ORDER BY id) FROM course_fee_head) AS fee_head_info
    FROM fillup_forms ff

    LEFT JOIN users u ON u.id = ff.student_id
    LEFT JOIN enrolled_courses ec ON ec.form_id = ff.id
    LEFT JOIN course c ON c.id = ec.course_id
    LEFT JOIN batch b ON b.id = ec.batch_id
    LEFT JOIN session s ON s.id = ec.session_id

    -- LEFT JOIN each_form_fee_info effi ON effi.form_id = ff.id

    LEFT JOIN LATERAL (
      SELECT
        ffs.form_id,
        ffs.fee_head_id,
        cfh.name AS fee_head_name,
        CASE
          WHEN ffs.fee_head_id = 4 THEN MAX(ffs.amount) / c.duration
        ELSE MAX(ffs.amount)
        END AS total_amount,
        
        CASE
          WHEN ffs.fee_head_id = 4 THEN COALESCE(SUM(p.amount) FILTER (WHERE mode = 'Discount'), 0) / c.duration
        ELSE COALESCE(SUM(p.amount) FILTER (WHERE mode = 'Discount'), 0)
        END AS any_discount,

        CASE
          WHEN ffs.fee_head_id = 4 THEN
          (MAX(ffs.amount) / c.duration) - (COALESCE(SUM(p.amount) FILTER (WHERE mode = 'Discount'), 0) / c.duration)
        ELSE COALESCE(MAX(ffs.amount), 0) - COALESCE(SUM(p.amount) FILTER (WHERE mode = 'Discount'), 0)
        END AS actule_fee_after_discount,

        CASE
          WHEN ffs.fee_head_id = 4 THEN MAX(ffs.amount)
        ELSE NULL
        END AS total_monthly_fee_in_this_session, -- this is only for monthly fees
        
        COALESCE(SUM(p.amount) FILTER (WHERE mode != 'Discount'), 0) AS total_fee_collected,

        CASE
          WHEN ffs.fee_head_id = 4 THEN COALESCE(MAX(ffs.amount), 0) - COALESCE(SUM(p.amount) FILTER (WHERE mode != 'Discount'), 0)
        ELSE COALESCE(MAX(ffs.amount), 0) - COALESCE(SUM(p.amount) FILTER (WHERE mode = 'Discount'), 0) - COALESCE(SUM(p.amount) FILTER (WHERE mode != 'Discount'), 0)
        END AS pending_amount
      FROM form_fee_structure ffs
      
      LEFT JOIN course_fee_head cfh
      ON cfh.id = ffs.fee_head_id
      
      LEFT JOIN payments p
      ON p.form_id = ffs.form_id AND p.fee_head_id = ffs.fee_head_id
      
      GROUP BY ffs.form_id, ffs.fee_head_id, cfh.id
      
      ORDER BY ffs.form_id
    ) effi ON effi.form_id = ff.id

    GROUP BY u.id, c.id, ff.id, s.id, b.id

    ORDER BY ff.id;
  `, [], {
    batchSize: 10,
  })

  const pgStream = client.query(query);

  let index = 0;
  const created_fee_head_column_info: {
    colname: string;
    fee_head_id: number;
    type: "total_fee" | "discount_amount" | "total_monthly_fee_in_this_session" | "actule_fee_after_disc" | "total_fee_collected" | "pending_fee";
  }[] = [];
  pgStream.on("data", data => {
    pgStream.pause();

    if (index === 0) {

      worksheet.getCell(
        "A1"
      ).value = `Fee Summery Report (${data.course_name}) (${data.batch_name}) (${data.session_name}`;

      const ROW_NUMBER = 3;
      let currentCol = 8 // Start at column H (8th col)

      data.fee_head_info.forEach((item: any) => {
        const colName1 = getExcelColumnName(currentCol);
        const cell1 = worksheet.getCell(`${colName1}${ROW_NUMBER}`);

        cell1.value = `Total ${item.name}`;

        created_fee_head_column_info.push({
          type: "total_fee",
          fee_head_id: item.id,
          colname: colName1
        })

        const colName2 = getExcelColumnName(currentCol + 1);
        const cell2 = worksheet.getCell(`${colName2}${ROW_NUMBER}`);

        cell2.value = `Discount Amount For ${item.name}`;

        created_fee_head_column_info.push({
          type: "discount_amount",
          fee_head_id: item.id,
          colname: colName2
        })

        const colName3 = getExcelColumnName(currentCol + 2);
        const cell3 = worksheet.getCell(`${colName3}${ROW_NUMBER}`);

        cell3.value = `Actual ${item.name} After Discount`;

        created_fee_head_column_info.push({
          type: "actule_fee_after_disc",
          fee_head_id: item.id,
          colname: colName3
        })


        let cell6: ExcelJS.Cell | null = null;
        if (item.id === 4) {
          const colName6 = getExcelColumnName(currentCol + 3);
          cell6 = worksheet.getCell(`${colName6}${ROW_NUMBER}`);

          cell6.value = `Total ${item.name} for this Session`;

          created_fee_head_column_info.push({
            type: "total_monthly_fee_in_this_session",
            fee_head_id: item.id,
            colname: colName6
          })
        }

        const colName4 = getExcelColumnName(currentCol + (item.id === 4 ? 4 : 3));
        const cell4 = worksheet.getCell(`${colName4}${ROW_NUMBER}`);

        cell4.value = `Total ${item.name} Collected`;

        created_fee_head_column_info.push({
          type: "total_fee_collected",
          fee_head_id: item.id,
          colname: colName4
        })

        const colName5 = getExcelColumnName(currentCol + (item.id === 4 ? 5 : 4));
        const cell5 = worksheet.getCell(`${colName5}${ROW_NUMBER}`);

        cell5.value = `Pending ${item.name}`;

        created_fee_head_column_info.push({
          type: "pending_fee",
          fee_head_id: item.id,
          colname: colName5
        });

        [cell1, cell2, cell3, cell4, cell5, cell6].forEach(cell => {
          if (cell !== null) {
            cell.style = {
              alignment: { horizontal: "center", vertical: "middle" },
              border: {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
              }
            }
          }
        })

        // Merge the cells
        worksheet.mergeCells(`${colName1}2:${colName5}2`);
        const mergedCell = worksheet.getCell(`${colName1}2`);

        // Set value and style for the merged cell
        mergedCell.value = item.name;
        mergedCell.style = {
          font: { bold: true, size: 14 },
          alignment: { horizontal: 'center', vertical: 'middle' },
        };

        // Apply borders to all cells in the merged range
        const startCol = worksheet.getColumn(colName1).number;
        const endCol = worksheet.getColumn(colName5).number;

        for (let c = startCol; c <= endCol; c++) {
          const cell = worksheet.getCell(2, c);
          cell.border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: c === startCol ? { style: "thin" } : {},
            right: c === endCol ? { style: "thin" } : {},
          };
        }

        if (item.id === 4) {
          currentCol += 6;
        } else {
          currentCol += 5;
        }
      })

      const lastCellName = getExcelColumnName(currentCol);
      worksheet.mergeCells(`A1:${lastCellName}1`);

      index++;
    }

    const excelRow = worksheet.addRow([data.sr_no, data.student_name, data.form_name, data.course_name, data.batch_name, data.session_name, data.month_duration])

    created_fee_head_column_info.forEach(item => {
      const fee_info = data.fee_info.find((fee: any) => fee.fee_head_id == item.fee_head_id);
      const cell = worksheet.getCell(`${item.colname}${excelRow.number}`);

      if (fee_info) {
        if (item.type === "total_fee") {
          cell.value = fee_info.total_amount;
        } else if (item.type === "discount_amount") {
          cell.value = fee_info.any_discount;
        } else if (item.type === "actule_fee_after_disc") {
          cell.value = fee_info.actule_fee_after_discount
        } else if (item.type === "total_fee_collected") {
          cell.value = fee_info.total_fee_collected
        } else if (item.type === "pending_fee") {
          cell.value = fee_info.pending_amount
        } else if (item.type === "total_monthly_fee_in_this_session") {
          cell.value = fee_info.total_monthly_fee_in_this_session
        } else {
          cell.value = "-"
        }
      } else {
        cell.value = "-"
      }
    })

    pgStream.resume();
  })


  pgStream.on("end", () => {
    workbook.commit();
    client.release(); // Release the client when done
  });

  pgStream.on("error", (err) => {
    client.release();
    workbook.commit();
    console.log(err);
    // throw new ErrorHandler(500, err.message);
  });
})