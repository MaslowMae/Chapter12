const express = require('express');
const inquire = require('inquirer');
const mysql = require('mysql2');
const prompt = inquirer.createPromptModule();

const PORT = process.env.PORT || 3001;
const app = express();

//middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//connect to database

const db = mysql.createConnection (
    {
        host: 'localhost',
        //mysql Username
        user:'root',
        password:  'password',
        database: 'companyResources_db'
    },
    console.log('linked to the company resources database.')
);

//create a new employee

app.post('/api/employees'), ({body}, res) => {
    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
    VALUES= (?),(?),(?),(?)`;
    const params = [body.first_name, body.last_name, body.role_id, body.manager_id];

    db.query('SELECT * FROM companyResources_db',params, (err,result) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'complete',
            data: body
        });
    });
};

//read all employees
app.get('/api/employees', (req, res) => {
    const sql ='select id, role_title AS role FROM employees';
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json({
            message: 'complete',
            data: rows
        });
    });
});
prompt(selectTask).then(
    {
        type: 'list',
        name: 'task',
        message: 'What would you like to do?',
        choices: [ 'View all employees', 'Add an employee','Update an employees role', 'delete an employee']
    },
    (answers) => {
        console.log(answers); 

        if (answers.task === 'View all employees') {
            console.log('view all employees');
        }
        if (answers.task === 'Add an employee') {
            app.post('/api/employees'), ({body}, req, res) => {
                const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
                VALUES= (?),(?),(?),(?)`;
                const params = [body.first_name, body.last_name, body.role_id, body.manager_id];
            
                db.query('SELECT * FROM companyResources_db',params, (err,result) => {
                    if (err) {
                        res.status(400).json({error: err.message});
                        return;
                    }
                    res.json({
                        message: 'complete',
                        data: body
                    });
                });
            }
            console.log('add an employee');
        }
    }
        if (answers.task === 'Update an employees role') {
            console.log('update an employees role');

            app.get('/api/employees', (req, res) => {
                const sql ='select id, role_title AS role FROM employees';
                db.query(sql, (err, rows) => {
                    if (err) {
                        res.status(500).json({error: err.message});
                        return;
                    }
                    res.json({
                        message: 'complete',
                        data: rows
                    });
                });
            });
        }
        if (answers.task === 'delete an employee') {
            console.log('delete an employee');

            app.delete('/api/employees/:id', (req, res) => {   
                const sql = `DELETE FROM employees WHERE id = ?`;
                const params = [req.params.id];
            
                db.query(sql, params, (err, result) => {
                    if (err) {
                        res.status(400).json({error: err.message});
                        return;
                    } else if (!result.affectedRows) {
                        res.json({
                            message: 'Employee not found'
                        });
                    } else {
                        res.json({
                            message: 'deleted',
                            changes: result.affectedRows,
                            id: req.params.id
                        });
                    }
                });
            });
//prompt the user to enter the employee information
prompt(addEmployee).then(
    {
        type: 'input',
        name: 'first_name',
        message: 'Enter the first name of the new employee.'
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'Enter the last name of the new employee.'
    },
    {
        type: 'dropdown',
        choices: ['Lead', 'Support', 'Engineer'],
        message: 'Enter the title of the new employee.'

    } 
);
(answers) => {
    console.log(answers);
}});