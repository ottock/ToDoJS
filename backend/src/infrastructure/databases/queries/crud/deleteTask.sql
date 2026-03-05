DELETE FROM tasks
WHERE id = $1
RETURNING id, name, created_date, priority, description, status;