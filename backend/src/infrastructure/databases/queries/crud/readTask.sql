SELECT
    id,
    name,
    priority,
    description,
    status
FROM
    tasks
WHERE
    id = $1;