// index.js
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const PORT = 8000;
const pool = require('./db');
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/signup', async (req, res) => {
  const { userName, gmail, password } = req.body;
  // Basic validation (optional)
  if (!userName || !gmail || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Optional: check if email already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE gmail = $1', [gmail]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (name, gmail, password) VALUES ($1, $2, $3) RETURNING *',
      [userName, gmail, password]
    );

    res.status(201).json({ message: 'Signup successful', user: result.rows[0] });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/login', async (req, res) => {
  const { gmail, password } = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE gmail = $1', [gmail]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users'); // assuming you have a users table
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

app.put('/update-password', async (req, res) => {
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
    console.error(err);
    res.status(500).send('Database error');
  }
});


app.delete('/users/:id', async (req, res) => {
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
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
