UPDATE
    tasks
SET
    name = $2,
    priority = $3,
    description = $4,
    status = $5,
    from_date = $6,
    due_date = $7
WHERE
    id = $1
RETURNING *;