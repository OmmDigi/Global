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
    password TEXT NOT NULL,
    UNIQUE (email)
);
-- Create Admin User
SELECT * FROM public.users
ORDER BY id ASC 

INSERT INTO users (
        category,
        name,
        email,
        ph_no,
        designation,
        password
    )
SELECT 
    'Admin',
	'Global Technical',
    'global.technical8.institute@gmail.com',
    '123456789',
    'Admin User',
    '96b0dbb494195764415927a06d1964e0:d5697f8e382d96d3080524247206e0e3590d14:cd15b7b2ffe993681092f6ac2dfc3f46'
WHERE NOT EXISTS (
        SELECT 1
        FROM users
        WHERE email = 'global.technical8.institute@gmail.com'
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
    session_id BIGINT,
    FOREIGN KEY (session_id) REFERENCES session(id),
    payment_mode VARCHAR(255) NOT NULL,
    duration VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0.00,
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