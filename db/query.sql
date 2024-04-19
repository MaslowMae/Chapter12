SELECT department.name AS department, roles.title AS role, employees.first_name, employees
FROM employees
LEFT JOIN roles ON employees.roles_id = roles.id
ORDER BY department.name;
