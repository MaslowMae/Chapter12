DROP DATABASE IF EXISTS companyResources_db;
CREATE DATABASE companyResources_db;

USE companyResources_db;

CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(29) NOT NULL
);
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(20) NOT NULL,
    salary INT NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);
Create Table employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name Varchar(29) NOT NULL,
    last_name Varchar(29) NOT NULL,
    roles_id INT NOT NULL,
    manager_id INT,
    department_id INT,
    FOREIGN KEY (roles_id) REFERENCES roles(id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);