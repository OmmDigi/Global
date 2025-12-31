-- CREATE DATABASE IF NOT EXISTS global;
-- TBL USERS
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    ph_no VARCHAR(15) NOT NULL,
    joining_date DATE DEFAULT CURRENT_DATE,
    designation VARCHAR(255) NULL,
    description TEXT,
    image TEXT,
    username VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
	permissions TEXT,
    UNIQUE (username)
);
-- Create Admin User
INSERT INTO users (
        category,
        name,
        email,
        ph_no,
        designation,
        username,
        password,
        permissions
    )
SELECT 'Admin',
    'Global Technical',
    'global.technical8.institute@gmail.com',
    '123456789',
    'Admin User',
    'global.technical8.institute@gmail.com',
    '96b0dbb494195764415927a06d1964e0:d5697f8e382d96d3080524247206e0e3590d14:cd15b7b2ffe993681092f6ac2dfc3f46',
    '[1,2,3,4,5,6,7,8,9,10,11, 12, 13, 14, 15, 16, 17, 18, 19, 20]'
WHERE NOT EXISTS (
        SELECT 1
        FROM users
        WHERE username = 'global.technical8.institute@gmail.com'
    );
-- TBL SESSION
CREATE TABLE IF NOT EXISTS session (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS course (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    payment_mode VARCHAR(255) NOT NULL,
    duration VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0.00,
    min_pay DECIMAL(10, 2) DEFAULT 0.00,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT false
);
-- TBL SESSION
CREATE TABLE IF NOT EXISTS notice (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS notice_sent (
    notice_id BIGINT,
    user_id BIGINT,
    course_id BIGINT,
    FOREIGN KEY (notice_id) REFERENCES notice(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE
);
-- TBL BATCHES
CREATE TABLE IF NOT EXISTS batch (
    id SERIAL PRIMARY KEY,
    course_id BIGINT,
    session_id BIGINT,
    month_name VARCHAR(50),
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES session(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS course_fee_head (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    is_active BOOLEAN DEFAULT false
);
CREATE TABLE IF NOT EXISTS course_fee_structure (
    id SERIAL PRIMARY KEY,
    course_id BIGINT,
    fee_head_id BIGINT,
    amount DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE,
    FOREIGN KEY (fee_head_id) REFERENCES course_fee_head(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS fillup_forms (
    id SERIAL PRIMARY KEY,
    form_name VARCHAR(255),
    student_id BIGINT NOT NULL,
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS form_fee_structure (
    id SERIAL PRIMARY KEY,
    form_id BIGINT,
    fee_head_id BIGINT,
    amount DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (form_id) REFERENCES fillup_forms(id) ON DELETE CASCADE,
    FOREIGN KEY (fee_head_id) REFERENCES course_fee_head(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS enrolled_courses (
    id SERIAL PRIMARY KEY,
    form_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    batch_id BIGINT NOT NULL,
    session_id BIGINT NOT NULL,
    course_price DECIMAL(10, 2) DEFAULT 0.00,
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES fillup_forms(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES batch(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES session(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS admission_data (
    id SERIAL PRIMARY KEY,
    form_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    admission_details TEXT,
    FOREIGN KEY (form_id) REFERENCES fillup_forms(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    form_id BIGINT NOT NULL,
    mode VARCHAR(50),
    student_id BIGINT NOT NULL,
    payment_name_id VARCHAR(255) NOT NULL,
    order_id VARCHAR(255),
    receipt_id VARCHAR(255),
    amount DECIMAL(10, 2) DEFAULT 0.00,
    fee_head_id BIGINT,
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES fillup_forms(id) ON DELETE CASCADE,
    FOREIGN KEY (fee_head_id) REFERENCES course_fee_head(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE SEQUENCE fillup_form_seq;
CREATE SEQUENCE receipt_no_seq;
ALTER TABLE course DROP COLUMN payment_mode;
ALTER TABLE course DROP COLUMN price;
ALTER TABLE course DROP COLUMN min_pay;
ALTER TABLE enrolled_courses DROP COLUMN course_price;
ALTER TABLE course_fee_structure
ADD COLUMN min_amount DECIMAL(10, 2) DEFAULT 0.00;
ALTER TABLE course_fee_structure
ADD COLUMN required BOOLEAN DEFAULT false;
ALTER TABLE form_fee_structure
ADD COLUMN min_amount DECIMAL(10, 2) DEFAULT 0.00;
ALTER TABLE form_fee_structure
ADD COLUMN required BOOLEAN DEFAULT false;
ALTER TABLE payments
ADD COLUMN transition_id VARCHAR(255);
ALTER TABLE admission_data
ADD CONSTRAINT unique_form_id_student_id UNIQUE (form_id, student_id);

CREATE TABLE IF NOT EXISTS holiday(
    id SERIAL PRIMARY KEY,
    holiday_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL
);
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    in_time TIMESTAMP NOT NULL,
    out_time TIMESTAMP,
    date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(255) CHECK (
        status IN ('Present', 'Absent', 'Leave', 'Holiday')
    ),
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (employee_id, date)
);
ALTER TABLE attendance
ALTER COLUMN in_time DROP NOT NULL;
CREATE TABLE IF NOT EXISTS leave (
    id SERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    reason TEXT,
    status INT DEFAULT 1,
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE
);

-- before check leave apply check is leave avilable or not
CREATE OR REPLACE FUNCTION can_apply_leave(
    p_employee_id BIGINT,
    p_from_date DATE,
    p_to_date DATE
)
RETURNS TABLE (
    available_leaves INTEGER,
    requested_days_count INTEGER,
    can_apply BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    WITH attendance_summary AS (
        SELECT
            DATE_TRUNC('month', a.date) AS month,
            COUNT(*) FILTER (WHERE a.status = 'Present')::INT AS present_days,
            COUNT(*) FILTER (WHERE a.status = 'Leave')::INT AS leave_days
        FROM attendance a
        WHERE a.employee_id = p_employee_id
          AND a.date >= (SELECT joining_date + INTERVAL '1 year'
                         FROM users WHERE id = p_employee_id)
        GROUP BY DATE_TRUNC('month', a.date)
    ),
    holidays_per_month AS (
        SELECT DATE_TRUNC('month', h.date) AS month, COUNT(*)::INT AS holiday_count
        FROM holiday h
        GROUP BY DATE_TRUNC('month', h.date)
    ),
    valid_months AS (
        SELECT
            s.month,
            s.leave_days,
            (26 - COALESCE(h.holiday_count, 0))::INT AS required_present,
            s.present_days
        FROM attendance_summary s
        LEFT JOIN holidays_per_month h ON h.month = s.month
        WHERE s.present_days >= (26 - COALESCE(h.holiday_count, 0))
    ),
    leave_balance AS (
        SELECT
            (COUNT(*) - COALESCE(SUM(leave_days), 0))::INT AS available_leaves
        FROM valid_months
    ),
    requested AS (
        SELECT (p_to_date - p_from_date + 1)::INT AS requested_days
    )
    SELECT
        COALESCE(lb.available_leaves, 0)::INT AS available_leaves,
        COALESCE(r.requested_days, 0)::INT AS requested_days_count,
        (
            COALESCE(lb.available_leaves, 0) >= COALESCE(r.requested_days, 0)
            AND p_from_date >= CURRENT_DATE
            AND p_to_date  >= CURRENT_DATE
        ) AS can_apply
    FROM leave_balance lb, requested r;
END;
$$ LANGUAGE plpgsql;



CREATE TABLE IF NOT EXISTS vendor (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    service_type VARCHAR(255),
    address TEXT,
    contact_details VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- INVENTORY
CREATE TABLE IF NOT EXISTS purchase_record (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    bill_no VARCHAR(255),
    per_item_rate DECIMAL (10, 2) DEFAULT 0.00,
    company_details TEXT,
    purchase_date DATE NOT NULL,
    expaire_date DATE,
    previousBalance INT DEFAULT 0,
    presentBalance INT DEFAULT 0,
    quantityReceived INT DEFAULT 0,
    description TEXT,
    file TEXT
);

-- CREATE TABLE inventory_items (
--     item_id SERIAL PRIMARY KEY,
--     item_name VARCHAR(255),
--     -- category INTEGER,
--     -- sub_category INTEGER,
--     where_to_use VARCHAR(255),
--     used_by VARCHAR(255),
--     description TEXT,
--     minimum_quantity INTEGER,
--     -- institute VARCHAR(255),
--     vendor_id INTEGER,
--     FOREIGN KEY (vendor_id) REFERENCES vendor(id) ON DELETE SET NULL
-- );

-- CREATE TABLE inventory_transactions (
--     inventory_transaction_id SERIAL PRIMARY KEY,
--     item_id INTEGER,
--     FOREIGN KEY (item_id) REFERENCES inventory_items(item_id) ON DELETE CASCADE,
--     transaction_type TEXT CHECK (transaction_type IN ('add', 'consume')),
--     -- or use ENUM
--     quantity INTEGER NOT NULL,
--     quantity_status TEXT,
--     transaction_date DATE NOT NULL,
--     cost_per_unit DECIMAL(10, 2) NOT NULL,
--     total_value DECIMAL(10, 2) NOT NULL,
--     remark TEXT
-- );

-- ALTER TABLE inventory_items
-- ADD COLUMN created_at DATE DEFAULT CURRENT_DATE;
-- -- 1. Speed up joins and date filtering in transactions
-- CREATE INDEX idx_transactions_item_date ON inventory_transactions (item_id, transaction_date);
-- -- 2. Improve filtering by transaction type, used in grouped sums and lateral joins
-- CREATE INDEX idx_transactions_item_type_date ON inventory_transactions (item_id, transaction_type, transaction_date);
-- -- 3. Help with filtering based on created date of items
-- CREATE INDEX idx_items_created_at ON inventory_items (created_at);
-- -- 54. Speed up vendor lookup
-- CREATE INDEX idx_vendor_id ON vendor (id);


-- CREATE TABLE stuff_salary_structure (

-- )

-- CREATE TABLE employee_fee_structure (
--     id SERIAL PRIMARY KEY,
    
--     employee_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
-- 	course_id BIGINT REFERENCES course(id) ON DELETE CASCADE,

--     fee_head_name TEXT NOT NULL,
--     amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,

--     UNIQUE(employee_id, course_id, fee_head_name)
-- );

-- ALTER TABLE employee_fee_structure ADD COLUMN extra DECIMAL(10, 2) DEFAULT 0.00; 


-- CREATE TABLE teacher_class_attendance (
--     id SERIAL PRIMARY KEY,

--     employee_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

--     course_id BIGINT NOT NULL REFERENCES course(id) ON DELETE CASCADE,

--     class_attend_count INT DEFAULT 0,

--     date DATE DEFAULT CURRENT_DATE
-- );

CREATE TABLE employee_salary_structure (
    id SERIAL PRIMARY KEY,
    employee_id BIGINT REFERENCES users(id),
    course_id BIGINT REFERENCES course(id),
    salary_type VARCHAR(255) NOT NULL,  -- NOT NULL CHECK (salary_type IN ('per_class', 'fixed', 'workshop', 'extra')),
    amount DECIMAL(12,2) DEFAULT 0.00,       -- if per_class / workshop / extra
    -- fixed_amount DECIMAL(12,2), -- if fixed monthly
    UNIQUE(employee_id, course_id, salary_type)
);

ALTER TABLE employee_salary_structure ADD COLUMN class_per_month INT; 
ALTER TABLE employee_salary_structure ADD COLUMN amount_type TEXT CHECK (amount_type IN ('addition', 'deduction')) DEFAULT 'addition';

CREATE TABLE teacher_classes (
    id SERIAL PRIMARY KEY,
    teacher_id BIGINT REFERENCES users(id),
    course_id BIGINT REFERENCES course(id),
    class_date DATE DEFAULT CURRENT_DATE,
    -- class_type TEXT CHECK (class_type IN ('regular', 'workshop', 'extra')),
    class_type TEXT CHECK (class_type IN ('fixed', 'per_class', 'workshop', 'extra')),
    units INT DEFAULT 1 -- ex : how much regular/workshop/extra classes done
);

ALTER TABLE teacher_classes ADD COLUMN daily_earning DECIMAL(10, 2) DEFAULT 0.00;

CREATE TABLE payslip (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    payslip_data TEXT,
    month DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (user_id, month)
);

CREATE TABLE employee_loan_or_advance_payment (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    total_amount DECIMAL(10, 2) DEFAULT 0.00,
    monthly_return_amount DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE amc_list (
    id SERIAL PRIMARY KEY,
    product_name TEXT,
    company_name TEXT,
    time_duration VARCHAR(255),

    contract_from DATE,
    contract_to DATE,

    renewal_date DATE,
    
    expiry_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE amc_list ADD COLUMN file TEXT;


CREATE TABLE inventory_items_v2 (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(255),
    minimum_quantity INTEGER DEFAULT 0,
    created_at DATE DEFAULT CURRENT_DATE
);

CREATE TABLE inventory_transactions_v2 (
    id SERIAL PRIMARY KEY,

    item_id BIGINT,
    FOREIGN KEY (item_id) REFERENCES inventory_items_v2(id) ON DELETE CASCADE,

    transaction_type TEXT CHECK (transaction_type IN ('add', 'consume')),

    vendor_id BIGINT,
    FOREIGN KEY (vendor_id) REFERENCES vendor(id) ON DELETE SET NULL,

    quantity INT DEFAULT 0,

    transaction_date DATE,

    cost_per_unit DECIMAL(10, 2) DEFAULT 0.00,

    remark TEXT
);

ALTER TABLE fillup_forms ADD COLUMN declaration_status INT DEFAULT 0;


INSERT INTO course_fee_head
    (id, name, is_active) 
VALUES 
    ('1', 'Admission form fee', 'TRUE'),
    ('2', 'Dress and Icard fee', 'TRUE'),
    ('3', 'Admission fee', 'TRUE'),
    ('4', 'Monthly fees', 'TRUE'),
    ('5', 'late fine', 'TRUE'),
    ('6', 'BSS Registration fee', 'TRUE'),
    ('7', 'Examination fee', 'TRUE'),
    ('8', 'Excursion fee', 'TRUE'),
    ('9', 'Saraswati Puja fee', 'TRUE'),
    ('10', 'Summer camp fee for teachers training ', 'TRUE'),
    ('11', 'Workshop fee', 'TRUE');

ALTER TABLE payments ADD COLUMN remark TEXT; 
ALTER TABLE payments ADD COLUMN payment_date DATE;
ALTER TABLE payments ADD COLUMN month DATE;

ALTER TABLE course DROP COLUMN duration;
ALTER TABLE course ADD COLUMN duration INT DEFAULT 0;
ALTER TABLE course ADD COLUMN duration_name TEXT DEFAULT 'month' CHECK (duration_name IN ('month', 'year'));

ALTER TABLE payments ADD COLUMN bill_no VARCHAR(255);

CREATE TABLE deleted_payments (
    payment_row_id BIGINT,
    payment_info TEXT,

    form_id BIGINT,
    FOREIGN KEY (form_id) REFERENCES fillup_forms(id) ON DELETE SET NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admission_fee_head_amount_history (
    session_id BIGINT,

    fee_head_id BIGINT,

    previous_amount DECIMAL(10, 2) DEFAULT 0.00,
    current_amount DECIMAL(10, 2) DEFAULT 0.00,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE deleted_payments ADD COLUMN user_id BIGINT REFERENCES users(id);

ALTER TABLE form_fee_structure 
ADD CONSTRAINT unique_form_id_fee_head_id UNIQUE(form_id, fee_head_id);

ALTER TABLE purchase_record DROP COLUMN per_item_rate;
ALTER TABLE purchase_record ADD COLUMN total_item_rate DECIMAL(10, 2) DEFAULT 0.00;


CREATE TABLE IF NOT EXISTS inventory_item_receivers_v2 (
    id SERIAL PRIMARY KEY,

    transition_id BIGINT REFERENCES inventory_transactions_v2(id) ON DELETE CASCADE,

    receiver_type VARCHAR(100) NOT NULL,
    receiver_value VARCHAR(255) NOT NULL,

    bill_no VARCHAR(255)
);

ALTER TABLE admission_fee_head_amount_history 
    ADD COLUMN course_id BIGINT REFERENCES course(id) ON DELETE SET NULL;

ALTER TABLE admission_fee_head_amount_history 
    ADD COLUMN batch_id BIGINT REFERENCES batch(id) ON DELETE SET NULL;

ALTER TABLE course_fee_head
    ADD COLUMN position SERIAL;

UPDATE course_fee_head SET position = 1 WHERE id = 3;
UPDATE course_fee_head SET position = 2 WHERE id = 14;
UPDATE course_fee_head SET position = 3 WHERE id = 2;
UPDATE course_fee_head SET position = 4 WHERE id = 12;
UPDATE course_fee_head SET position = 5 WHERE id = 4;
UPDATE course_fee_head SET position = 6 WHERE id = 5;
UPDATE course_fee_head SET position = 7 WHERE id = 6;
UPDATE course_fee_head SET position = 8 WHERE id = 7;
UPDATE course_fee_head SET position = 9 WHERE id = 10;
UPDATE course_fee_head SET position = 10 WHERE id = 11;
UPDATE course_fee_head SET position = 11 WHERE id = 8;
UPDATE course_fee_head SET position = 12 WHERE id = 9;

UPDATE course_fee_head SET position = 13 WHERE id = 13;
UPDATE course_fee_head SET position = 14 WHERE id = 1;

ALTER TABLE fillup_forms
    ADD COLUMN admission_date DATE;

CREATE TABLE IF NOT EXISTS enquiry (
    id SERIAL PRIMARY KEY,

    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    message TEXT
);


CREATE TABLE IF NOT EXISTS copy_move_logs (
   id SERIAL PRIMARY KEY,

   user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,

   data JSONB,

   action_type VARCHAR(20),

   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);