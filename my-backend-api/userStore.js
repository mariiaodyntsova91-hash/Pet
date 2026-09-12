const { randomUUID } = require('crypto');
const users = new Map();

const normalizeEmail = (email) => email.trim().toLowerCase();

const findByEmail = (email) => users.get(normalizeEmail(email));

const createUser = ({ name, email, password }) => {
    const normalizedEmail = normalizeEmail(email);
    const user = {
        id: randomUUID(),
        name: name.trim(),
        email: normalizedEmail,
        password
    };

    users.set(normalizedEmail, user);
    return user;
};

module.exports = { findByEmail, createUser };
