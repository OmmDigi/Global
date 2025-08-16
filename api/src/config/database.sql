CREATE DATABASE IF NOT EXISTS global;
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
    '[1,2,3,4,5,6,7,8,9,10,11]'
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

CREATE TABLE inventory_items (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(255),
    -- category INTEGER,
    -- sub_category INTEGER,
    where_to_use VARCHAR(255),
    used_by VARCHAR(255),
    description TEXT,
    minimum_quantity INTEGER,
    -- institute VARCHAR(255),
    vendor_id INTEGER,
    FOREIGN KEY (vendor_id) REFERENCES vendor(id) ON DELETE SET NULL
);

CREATE TABLE inventory_transactions (
    inventory_transaction_id SERIAL PRIMARY KEY,
    item_id INTEGER,
    FOREIGN KEY (item_id) REFERENCES inventory_items(item_id) ON DELETE CASCADE,
    transaction_type TEXT CHECK (transaction_type IN ('add', 'consume')),
    -- or use ENUM
    quantity INTEGER NOT NULL,
    quantity_status TEXT,
    transaction_date DATE NOT NULL,
    cost_per_unit DECIMAL(10, 2) NOT NULL,
    total_value DECIMAL(10, 2) NOT NULL,
    remark TEXT
);

ALTER TABLE inventory_items
ADD COLUMN created_at DATE DEFAULT CURRENT_DATE;
-- 1. Speed up joins and date filtering in transactions
CREATE INDEX idx_transactions_item_date ON inventory_transactions (item_id, transaction_date);
-- 2. Improve filtering by transaction type, used in grouped sums and lateral joins
CREATE INDEX idx_transactions_item_type_date ON inventory_transactions (item_id, transaction_type, transaction_date);
-- 3. Help with filtering based on created date of items
CREATE INDEX idx_items_created_at ON inventory_items (created_at);
-- 54. Speed up vendor lookup
CREATE INDEX idx_vendor_id ON vendor (id);