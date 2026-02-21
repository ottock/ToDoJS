INSERT INTO tasks (name, priority, description, status)
VALUES ($1, $2, $3, $4)
RETURNING id, name, priority, description, status;