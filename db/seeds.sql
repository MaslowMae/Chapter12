INSERT INTO companyResources (companyResources.employees, role_id)
    VALUES ('Harry', 'Potter',1),
    ('Ron', 'Weasly',2),
    ('Hermoine', 'Granger',3);

INSERT INTO roles (role_id, title, salary, department_id)
    VALUES (1, 'Lead', 100000, 1),
    (2, 'Support', 50000, 2),
    (3, 'Engineer', 75000, 3);       

INSERT INTO department (name)
VALUES ('Leadership'),
('Tier 1 Support'),
('Tier 2 Support');


