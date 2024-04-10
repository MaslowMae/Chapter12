const express = require('express');
const inquirer = require('inquirer');
const router = express.Router();

// Route to create a new employee
app.post('/api/employees', async (req, res) => {
    try {
        const answers = await promptEmployeeDetails();
        const { first_name, last_name, role_id, manager_id } = answers;
        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
                    VALUES (?, ?, ?, ?)`;
        const params = [first_name, last_name, role_id, manager_id];

        db.query(sql, params, (err, result) => {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            res.json({
                message: 'Employee added to department',
                data: {
                    id: result.insertId,
                    first_name,
                    last_name,
                    role_id,
                    manager_id
                }
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'could not add employee.' });
    }
});
