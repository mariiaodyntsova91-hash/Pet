require('dotenv').config();
const express = require('express');
const cors = require('cors');
const requireAuth = require('./authMiddleware');
const authRoutes = require('./authRoutes');
const app = express();
const PORT = process.env.PORT || 4200;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/api/data', requireAuth, (req, res) => {
    res.json({ message: 'Hello from the Node.js server!' });
});

app.get('/api/protected', requireAuth, (req, res) => {
    res.json({ message: 'You have access to protected data.', user: req.user });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
