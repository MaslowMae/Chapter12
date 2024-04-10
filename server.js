const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'companyResources_db'
});

db.connect((err) => {
    if (err) {
        console.error('cannot connect to database:', err);
        return;
    }
    console.log('Connected to the company database');
});
//application starts and prompts the user to select task
async function promptTaslSelection() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'task',
            message: 'Select an action?',
            choices: [
                'View all employees',
                'Add an employee',
                'Delete an employee',
                'update an employee role',
            ]
        }
    ]);
}
// View all employees
async function viewAllEmployees() {
    try {
        const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS department, 
                    CONCAT(managers.first_name, ' ', managers.last_name) AS manager
                    FROM employees
                    LEFT JOIN roles ON employees.role_id = roles.id
                    LEFT JOIN departments ON roles.department_id = departments.id
                    LEFT JOIN employees managers ON employees.manager_id = managers.id`;
        const [rows] = await db.promise().query(sql);
        console.table(rows);
    } catch (error) {
        console.error('Error viewing employees:', error);
    }
}

// Prompt for new employee details
function promptForNewEmployeeDetails() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter first name:'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the last name:'
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'Enter the role ID:'
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'Enter the manager ID of the new employee:'
        }
    ]);
}
async function addEmployee() {
    try {
        const employee = await promptForNewEmployeeDetails();
        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
                        VALUES (?, ?, ?, ?)`;
        const params = [employee.first_name, employee.last_name, employee.role_id, employee.manager_id];
        await db.promise().query(sql, params);
        console.log('Employee added.');
    } catch (error) {
        console.error('Error adding new employee:', error);
    }
}
//prompt for employee ID to delete
async function promptDeleteEmployee() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'employeeId',
            message: 'Enter the ID of the employee to delete:'
        }
    ]);
}
async function deleteEmployee(employeeId) {
    try {
        const sql = 'DELETE FROM employees WHERE id = ?';
        const [result] = await db.promise().query(sql, [employeeId]);
        if (result.affectedRows === 0) {
            console.log('Employee not found.');
        } else {
            console.log('Employee deleted');
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
    }
}
//prompt for employees new role 
async function promptUpdateEmployeeRole() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'employeeId',
            message: 'Enter the ID of the employee to update:'
        },
        {
            type: 'input',
            name: 'roleId',
            message: 'Enter the new role ID for the employee:'
        }
    ]);
}
//update the employees role  
async function updateEmployeeRole(employeeId, roleId) {
    try {
        const sql = 'UPDATE employees SET role_id = ? WHERE id = ?';
        const [result] = await db.promise().query(sql, [roleId, employeeId]);
        if (result.affectedRows === 0) {
            console.log('Employee not found.');
        } else {
            console.log('Employee role updated.');
        }
    } catch (error) {
        console.error('Error updating employee role:', error);
    }
}
async function main() {
    const { task } = await promptTaskSelection();
    switch (task) {
        case 'View all employees':
            await viewAllEmployees();
            break;
        case 'Add an employee':
            await addEmployee();
            break;
            case 'Delete an employee':
                const { employeeId } = await promptDeleteEmployee();
                await deleteEmployee(employeeId);
                break;
            case 'Update an employee role':
                const { employeeId, roleId } = await promptUpdateEmployeeRole();
                await updateEmployeeRole(employeeId, roleId);
                break;
        } 
    }
// Start the app
main().then(() => {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}   ); 