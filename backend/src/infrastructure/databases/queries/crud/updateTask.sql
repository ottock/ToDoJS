UPDATE
    tasks
SET
    name = $2,
    priority = $3,
    description = $4,
    status = $5
WHERE
    id = $1
RETURNING id, name, priority, description, status;