INSERT INTO department ('name')
VALUES ('Leadership'),
('Tier 1 Support'),
('Tier 2 Support');


INSERT INTO roles (roles_id, title, salary, department_id)
    VALUES ('Manager', 100000, 1),
    ('Support', 50000, 2),
    ('Engineer', 75000, 3);       


INSERT INTO employees (first_name, last_name, roles_id, department_id)
    VALUES ('Harry', 'Potter',1,1),
    ('Ron', 'Weasly',2,2),
    ('Hermoine', 'Granger',3,3);