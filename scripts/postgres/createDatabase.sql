CREATE TABLE tasks (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_date DATE NOT NULL,
    priority CHAR(1) NOT NULL,
    CHECK (priority IN ('H','M','L')),
    description VARCHAR(255),
    status BOOLEAN NOT NULL,
    from_date DATE,
    due_date DATE,
    CHECK (from_date IS NULL OR due_date IS NOT NULL),
    CHECK (from_date IS NULL OR due_date IS NULL OR from_date <= due_date)
);