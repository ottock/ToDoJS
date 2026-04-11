INSERT INTO tasks (name, created_date, priority, description, status, from_date, due_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;