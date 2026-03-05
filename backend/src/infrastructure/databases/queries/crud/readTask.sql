SELECT
    id,
    name,
    created_date,
    priority,
    description,
    status
FROM
    tasks
WHERE
    id = $1;