DELETE FROM tasks
WHERE id = $1
RETURNING id, name, priority, description, status;