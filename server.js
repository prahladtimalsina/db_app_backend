const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Connect to SQLite Database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to SQLite database.');
        
        // Create table if not exists
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            address TEXT NOT NULL,
            contact_number TEXT NOT NULL
        )`, (tableErr) => {
            if (tableErr) {
                console.error('Error creating table', tableErr.message);
            } else {
                // Insert a default user if the table is empty
                db.get('SELECT COUNT(*) AS count FROM users', (countErr, row) => {
                    if (countErr) {
                        console.error('Error checking user count', countErr.message);
                    } else if (row.count === 0) {
                        db.run('INSERT INTO users (first_name, last_name, email, address, contact_number) VALUES (?, ?, ?, ?, ?)', 
                            ['John', 'Doe', 'john@example.com', '123 Main St, City', '1234567890'], 
                            (insertErr) => {
                                if (insertErr) {
                                    console.error('Error inserting default user', insertErr.message);
                                } else {
                                    console.log('Default user inserted.');
                                }
                            }
                        );
                    }
                });
            }
        });
    }
});

// Create a new user (C)
app.post('/users', (req, res) => {
    const { first_name, last_name, email, address, contact_number } = req.body;
    if (!first_name || !last_name || !email || !address || !contact_number) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    db.run(
        'INSERT INTO users (first_name, last_name, email, address, contact_number) VALUES (?, ?, ?, ?, ?)', 
        [first_name, last_name, email, address, contact_number], 
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else {
                res.json({ id: this.lastID, first_name, last_name, email, address, contact_number });
            }
        }
    );
});

// Read all users (R)
app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Read a single user by ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(row);
        }
    });
});

// Update a user by ID (U)
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, address, contact_number } = req.body;
    if (!first_name || !last_name || !email || !address || !contact_number) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    db.run(
        'UPDATE users SET first_name = ?, last_name = ?, email = ?, address = ?, contact_number = ? WHERE id = ?', 
        [first_name, last_name, email, address, contact_number, id], 
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ error: 'User not found' });
            } else {
                res.json({ id, first_name, last_name, email, address, contact_number });
            }
        }
    );
});

// Delete a user by ID (D)
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM users WHERE id = ?', id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json({ message: 'User deleted successfully' });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
