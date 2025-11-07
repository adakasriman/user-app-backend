const pool = require('../../config/sequelize');

 const getUsersList = async (req, res) => {
    console.log('User request for session:', req.sessionID);
    try {
        const result = await pool.query('SELECT * FROM users');
        const users = result.rows;

        res.json({ message: 'User found successfully', users });

    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
};

 const updatePassword = async (req, res) => {
    const { gmail, oldPassword, newPassword } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE gmail = $1', [gmail]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        if (user.password !== oldPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        await pool.query('UPDATE users SET password = $1 WHERE gmail = $2', [newPassword, gmail]);

        res.json({ message: 'Password updated successfully' });

    } catch (err) {
        res.status(500).send('Database error');
    }
};

 const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid user ID' });
        }

        await pool.query('DELETE FROM users WHERE id = $1', [userId]);

        res.json({ message: 'User deleted successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
};

module.exports = {
    getUsersList,
    updatePassword,
    deleteUser
};
