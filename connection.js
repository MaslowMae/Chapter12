const db = require('./db'); // Assuming db.js exports your MySQL connection pool

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

module.exports = updateEmployeeRole;