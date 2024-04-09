DROP DATABASE IF EXISTS companyResources_db;
CREATE DATABASE companyResources_db;

USE companyResources_db;

Create Table employees(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name Varchar(29) NOT NULL,
    last_name Varchar(29) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL,
    FOREIGN KEY (role_id) INT NOT NULL REFERENCES role(id),
    FOREIGN KEY (manager_id) INT NOT NULL REFERENCES department(id)

)

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(20) NOT NULL
    salary INT NOT NULL CURRENCY,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) INT NOT NULL REFERENCES department(id),
)

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(29) NOT NULL,
    roles_id INT NOT NULL,
)