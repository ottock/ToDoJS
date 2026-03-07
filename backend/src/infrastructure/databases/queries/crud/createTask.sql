INSERT INTO tasks (name, created_date, priority, description, status)
    VALUES ($1, $2, $3, $4, $5)
RETURNING *;