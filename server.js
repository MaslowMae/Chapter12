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
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'companyResources_db'
});

console.log('Entered into company database');

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

// View all roles
async function viewAllRoles() {
    try {
        const sql = 'SELECT * FROM roles';
        const [rows] = await db.promise().query(sql);
        console.table(rows);
    } catch (error) {
        console.error('Error viewing roles:', error);
    }
    return source(); // return to main menu
}

// View all departments
async function viewAllDepartments() {
    try {
        const sql = 'SELECT * FROM department';
        const [rows] = await db.promise().query(sql);
        console.table(rows);
    } catch (error) {
        console.error('Error viewing departments:', error);
    }
    return source(); // return to main menu
}

// Add a department
async function addDepartment() {
    try {
        const department = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter the department name:'
            }
        ]);
        const sql = 'INSERT INTO department (name) VALUES (?)';
        const [result] = await db.promise().query(sql, [department.name]);
        console.log('Department added.');
    } catch (error) {
        console.error('Error adding department:', error);
    }
    return source(); // return to main menu
}

// Add a role
async function addRole() {
    try {
        const roles = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the role title:'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the role salary:'
            },
            {
                type: 'input',
                name: 'department_id',
                message: 'Enter the department ID:'
            }
        ]);
    } catch (error) {
        console.error('Error adding role:', error);
    }
    return source(); // return to main menu
}

// View all employees
async function viewAllEmployees() {
    try {
        const sql = `SELECT employees.id, employees.first_name, employees.last_name, 
        roles.title, roles.salary, department.name AS department, 
        CONCAT(managers.first_name, ' ', managers.last_name) AS manager
        FROM employees
        LEFT JOIN roles ON employees.roles_id = roles.id
        LEFT JOIN department ON roles.department_id = department.id
        LEFT JOIN employees managers ON employees.manager_id = managers.id;`;
        const [rows] = await db.promise().query(sql);
        console.table(rows);
    } catch (error) {
        console.error('Error viewing employees:', error);
    }
    return source(); // return to main menu
}

// Add an employee
async function addEmployee() {
    try {
        const employee = await promptForNewEmployeeDetails();
        const sql = `INSERT INTO employees (first_name, last_name, roles_id, manager_id) VALUES (?, ?, ?, ?)`;
        const params = [employee.first_name, employee.last_name, employee.role_id, employee.manager_id];
        await db.promise().query(sql, params);
        console.log('Employee added.');
    } catch (error) {
        console.error('Error adding new employee:', error);
    }
    viewAllEmployees(); // view updated employee list
    return source(); // return to main menu
}

// Prompt for employee deletion
async function promptDeleteEmployee() {
    try {
        const query = "SELECT * FROM employees";
        const [rows] = await db.promise().query(query);
        const employeeList = rows.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));
        employeeList.push({ name: "Go Back", value: "back" }); // add a "back" option
        const answer = await inquirer.prompt({
            type: "list",
            name: "id",
            message: "Select the employee you want to delete:",
            choices: employeeList,
        });
        if (answer.id !== "back") {
            const deleteQuery = "DELETE FROM employees WHERE id = ?";
            await db.promise().query(deleteQuery, [answer.id]);
            console.log(`Deleted employee with ID ${answer.id} from the database!`);
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
    }
}

// Prompt for updating employee role
async function promptUpdateEmployeeRole() {
    try {
        // Query database to get a list of employees
        const query = "SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees";
        const [rows] = await db.promise().query(query);
        
        // Create a list of employee names
        const employeeList = rows.map((employee) => ({
            name: employee.name,
            value: employee.id,
        }));

        // Prompt user to select an employee to update
        const answer = await inquirer.prompt({
            type: "list",
            name: "employeeId",
            message: "Select the employee you want to update:",
            choices: employeeList,
        });

        // Prompt user to enter the new role ID
        const { roleId } = await inquirer.prompt({
            type: 'input',
            name: 'roleId',
            message: 'Enter the new role ID for the employee:'
        });

        return { employeeId: answer.employeeId, roleId };
    } catch (error) {
        console.error('Error updating employee role:', error);
    }
}

// Update employee role in db
async function updateEmployeeRole(employeeId, roleId) {
    try {
        const sql = 'UPDATE employees SET roles_id = ? WHERE id = ?';
        const [result] = await db.promise().query(sql, [roleId, employeeId]);
        if (result.affectedRows === 0) {
            console.log('Employee not found.');
        } else {
            console.log('Employee role updated.');
        }
    } catch (error) {
        console.error('Error updating employee role:', error);
    }
    viewAllEmployees() // view updated employee role
    return source(); // return to main menu
}

    promptTaskSelection = () => {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'task',
                message: 'What would you like to do?',
                choices: [
                    'View all employees',
                    'Add an employee',
                    'Delete an employee',
                    'Update an employee role',
                    'View all roles',
                    'View all departments',
                    'Add a department',
                    'Add a role'
                ]
            }
        ]);
    }


    //handle tasks at the beginning
    async function source() {
        try {
            const { task } = await promptTaskSelection();
            switch (task) {
                case 'View all employees':
                    await viewAllEmployees();
                    break;
                case 'Add an employee':
                    await addEmployee();
                    break;
                case 'Delete an employee':
                    const { empId } = await promptDeleteEmployee();
                    await deleteEmployee(empId);
                    break;
                case 'Update an employee role':
                    const { employeeId, roleId } = await promptUpdateEmployeeRole();
                    await updateEmployeeRole(employeeId, roleId);
                    break;
                case 'View all roles':
                    await viewAllRoles();
                    break;
                case 'View all departments':
                    await viewAllDepartments();
                    break;
                case 'Add a department':
                    await addDepartment();
                    break;
                case 'Add a role':
                    await addRole();
                    break;
            }
        } catch (error) {
            console.error('invalid task:', error);
        }
    }
    // Start the application
    source().then(() => {
        const PORT = process.env.PORT || 3020;
        app.listen(PORT, () => {
            console.log(`Ready on port ${PORT}`);
        });
    });

