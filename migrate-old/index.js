// const { data } = require("./public/mar-apr-2025");
const { data } = require("./public/teacher_tranning_mtt_mar.js");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const { generatePlaceholders, formatDateSafe } = require("./utils");
const fs = require("fs");

// Load environment variables based on NODE_ENV
dotenv.config({ path: ".env", override: true });

function configDb() {
  const dbConfig = {
    connectionString: process.env.POSTGRES_URL,
    ssl: false,
  };
  return dbConfig;
}

const pool = new Pool(configDb());

const SESSION_ID = 1; // 2025 - 2026
const COURSE_ID = 1; // TEACHERS TRAINING ( MTT )

const YEAR = 2025;
const MONTHS_NAME_AND_NUMBER = {
  january: "01",
  february: "02",
  march: "03",
  april: "04",
  may: "05",
  june: "06",
  july: "07",
  august: "08",
  september: "09",
  october: "10",
  november: "11",
  december: "12",
};

const ADMISSION_FEE_HEAD_ID = 3;
const MONTHLY_PAYMENT_FEE_HEAD_ID = 4;
// const DRESS_FEE_HEAD_ID = 2;
// const ICARD_FEE_HEAD_ID = 12;
// const EXAM_FEE_HEAD_ID = 7;
// const PROSPECTUS_FEE_HEAD_ID = 14;
// const SUMMER_CAMP_FEE_HEAD_ID = 10;
// const BSS_REGISTRATION_CAMP_FEE_HEAD_ID = 6;

const OTHER_FEE_HEAD_IDS = {
  dress: 2,
  iCard: 12,
  exam: 7,
  prospectus: 14,
  summerCamp: 10,
  bssRegistration: 6,
  lateFine: 5,
};

async function main() {
  const { rows } = await pool.query(
    `
    SELECT
      ec.*,
      u.id AS student_id,
      u.name AS student_name
    FROM enrolled_courses ec

    LEFT JOIN fillup_forms ff
    ON ff.id = ec.form_id

    LEFT JOIN users u
    ON u.id = ff.student_id

    WHERE ec.session_id = ${SESSION_ID} AND course_id = ${COURSE_ID} AND u.name IN (${data
      .map((item) => `'${item.name}'`)
      .join(", ")})
    `
  );

  const finalDataToInsert = [];

  // const studentNotRegister = data.filter(
  //   (item) => rows.find((row) => row.student_name == item.name) === undefined
  // );

  // console.log(studentNotRegister.map(item => item.name))

  // // student not registerd than register tham first
  // for (const notregister of studentNotRegister) {

  // }

  rows.forEach((row) => {
    const studentName = row.student_name;
    const currentRowInfo = data.find((item) => item.name == studentName);
    if (!currentRowInfo)
      throw new Error(
        `Unable to find this ${studentName} user in the ./public/mar-apr-2025.js file`
      );

    // process the admission fees
    const admissionData = currentRowInfo.admissionFeesPaymentDetails
      .split(" ")
      .filter((item) => item.trim() !== "");

    let paymentDate = "";
    let billNumber = "";
    let amount = "";
    let admissionPaymentMode = "Cash";

    admissionData.forEach((item, index) => {
      if (index % 3 === 0) {
        // this is for payment date
        paymentDate = item;
      } else if (index % 3 === 1) {
        // this is for bill number
        billNumber = item;
        if(billNumber.includes("OP")) {
          admissionPaymentMode = "Online";
        } else {
          admissionPaymentMode = "Cash";
        }
      } else if (index % 3 === 2) {
        // this is for amount
        amount = item;
      }

      if (index % 3 !== 2) return;

      finalDataToInsert.push({
        student_name: studentName,
        form_id: row.form_id,
        mode: admissionPaymentMode,
        student_id: row.student_id,
        payment_name_id: null,
        order_id: null,
        amount: amount,
        fee_head_id: ADMISSION_FEE_HEAD_ID,
        status: 2,
        payment_date: paymentDate,
        bill_no: billNumber,
        month: null,
      });
    });

    // process the monthly fee
    const monthlyFees = currentRowInfo.monthlyFees;
    for (const [key, value] of Object.entries(monthlyFees)) {
      if (value.date === "" && value.billNo === "") continue;

      let amountToAdd = 0;
      let paymentMode = "Cash";
      let lateFineAmount = 0;

      if (value.online !== "") {
        paymentMode = "Online";
        if (
          parseFloat(value.online) >
          parseFloat(currentRowInfo.monthlyFeesPerMonth)
        ) {
          amountToAdd = parseFloat(currentRowInfo.monthlyFeesPerMonth);
          lateFineAmount =
            parseFloat(value.online) -
            parseFloat(currentRowInfo.monthlyFeesPerMonth);
        } else {
          amountToAdd = parseFloat(value.online);
          lateFineAmount = 0;
        }
      }

      if (value.cash !== "") {
        paymentMode = "Cash";
        if (
          parseFloat(value.cash) >
          parseFloat(currentRowInfo.monthlyFeesPerMonth)
        ) {
          amountToAdd = parseFloat(currentRowInfo.monthlyFeesPerMonth);
          lateFineAmount =
            parseFloat(value.cash) -
            parseFloat(currentRowInfo.monthlyFeesPerMonth);
        } else {
          amountToAdd = parseFloat(value.cash);
          lateFineAmount = 0;
        }
      }

      finalDataToInsert.push({
        student_name: studentName,
        form_id: row.form_id,
        mode: paymentMode,
        student_id: row.student_id,
        payment_name_id: null,
        order_id: null,
        amount: amountToAdd,
        fee_head_id: MONTHLY_PAYMENT_FEE_HEAD_ID,
        status: 2,
        payment_date: value.date,
        bill_no: value.billNo,
        month: `${YEAR}-${MONTHS_NAME_AND_NUMBER[key]}-01`,
      });

      if (lateFineAmount !== 0) {
        //create payment row for late fine
        finalDataToInsert.push({
          student_name: studentName,
          form_id: row.form_id,
          mode: paymentMode,
          student_id: row.student_id,
          payment_name_id: null,
          order_id: null,
          amount: lateFineAmount,
          fee_head_id: OTHER_FEE_HEAD_IDS.lateFine,
          status: 2,
          payment_date: value.date,
          bill_no: null,
          month: `${YEAR}-${MONTHS_NAME_AND_NUMBER[key]}-01`,
        });
      }
    }

    // process other fees
    for (const [key, value] of Object.entries(currentRowInfo.otherFees)) {
      if (value.date === "" && value.billNo === "") continue;

      const FEE_HEAD_ID = OTHER_FEE_HEAD_IDS[key];

      if (!FEE_HEAD_ID) continue;

      finalDataToInsert.push({
        admission_date : currentRowInfo.dateOfAdmission,
        student_name: studentName,
        form_id: row.form_id,
        mode: value.online != "" ? "Online" : "Cash",
        student_id: row.student_id,
        payment_name_id: null,
        order_id: null,
        amount: value.online != "" ? value.online : value.cash,
        fee_head_id: FEE_HEAD_ID,
        status: 2,
        payment_date: value.date,
        bill_no: value.billNo,
        month: null,
      });
    }
  });

  const COLUMN_PER_ROW = 14;
  const TOTAL_ROWS = finalDataToInsert.length;

  const existFeeStructure = {};

  const form_fee_structure_table = [];

  for (let i = 0; i < finalDataToInsert.length; i++) {
    const data = finalDataToInsert[i];

    const key = `${data.form_id}-${data.fee_head_id}`;

    if (existFeeStructure[key] == undefined) {
      const index = form_fee_structure_table.push({
        form_id: data.form_id,
        fee_head_id: data.fee_head_id,
        amount: parseFloat(data.amount),
        admission_date : data.admission_date
      }) - 1;
      existFeeStructure[key] = index;
      continue;
    }

    const currentArrayItem = form_fee_structure_table[existFeeStructure[key]];
    currentArrayItem.amount += parseFloat(data.amount);
  }

  const date = new Date();
  const placeholders = Array.from({ length: TOTAL_ROWS }, (_, i) => {
    const offset = i * COLUMN_PER_ROW;
    const placeholders = Array.from({ length: COLUMN_PER_ROW }, (_, j) => {
      const num = offset + j + 1;
      if (j + 1 === 12) return `$${num}::date`;
      return `$${num}`;
    });
    return `(${placeholders.join(", ")})`;
  }).join(", ");

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    //store the form fee structure also

    // console.log(form_fee_structure_table.filter(item => item.admission_date !== undefined).length)

    await client.query(
      `
      UPDATE fillup_forms AS ff
      SET admission_date = v.admission_date::DATE
      FROM (
        VALUES
          ${form_fee_structure_table.filter(item => item.admission_date !== undefined).map(item => `(${item.form_id}, TO_CHAR(TO_DATE('${item.admission_date}', 'DD-MM-YYYY'), 'YYYY-MM-DD'))`).join(", ")}
      ) AS v(form_id, admission_date)
      WHERE ff.id = v.form_id::BIGINT;
      `
    )

    const placeholder = generatePlaceholders(form_fee_structure_table.length, 5);
    await client.query(
      `
      INSERT INTO form_fee_structure 
        (form_id, fee_head_id, amount, min_amount, required) 
      VALUES 
        ${placeholder}
      --ON CONFLICT (form_id, fee_head_id) DO UPDATE
      --SET amount = EXCLUDED.amount,
      --min_amount = EXCLUDED.amount
      ON CONFLICT (form_id, fee_head_id) DO NOTHING
    `,
      form_fee_structure_table.flatMap((item) => [
        item.form_id,
        item.fee_head_id,
        item.amount,
        item.amount,
        false,
      ])
    );

    //delete any old payments
    await client.query(
      `DELETE FROM payments WHERE form_id IN (${finalDataToInsert
        .map((item) => item.form_id)
        .join(", ")})`
    );

    await client.query(
      `
     INSERT INTO payments (form_id, mode, student_id, payment_name_id, order_id, receipt_id, amount, fee_head_id, status, transition_id, remark, payment_date, month, bill_no) VALUES
     ${placeholders}
    `,
      finalDataToInsert.flatMap((item) => {
        const paymentFormatedDate = formatDateSafe(item.payment_date);

        return [
          item.form_id,
          item.mode,
          item.student_id,
          item.payment_name_id ?? date.getTime(),
          item.order_id,
          null,
          item.amount,
          item.fee_head_id,
          item.status,
          null,
          null,
          paymentFormatedDate,
          item.month,
          item.bill_no,
        ];
      })
    );

    console.log("Migration DONE");

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    // throw new Error(error);
    console.error(error)
  } finally {
    client.release();
  }
}

main();
