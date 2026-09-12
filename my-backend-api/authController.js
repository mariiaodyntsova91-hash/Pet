const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findByEmail } = require('./userStore');

const createToken = (user) => jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
);

const publicUser = (user) => ({
    id: user.id,
    email: user.email,
    name: user.name
});

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }
        if (findByEmail(email)) {
            return res.status(409).json({ message: 'A user with this email already exists.' });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const user = createUser({ name, email, password: passwordHash });

        return res.status(201).json({ message: 'Registration successful.', token: createToken(user), user: publicUser(user) });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        return res.status(200).json({
            message: 'Login successful.',
            token: createToken(user),
            user: publicUser(user)
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { login, register };
