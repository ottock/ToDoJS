CREATE TABLE tasks (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    priority CHAR(1) NOT NULL,
    CHECK (priority IN ('H','M','L')),
    description VARCHAR(255),
    status BOOLEAN NOT NULL
);