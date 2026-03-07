const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

// Register Page
router.get('/register', (req, res) => {
    res.render('auth/register', { title: '회원가입' });
});

// Register Process
router.post('/register', async (req, res) => {
    const { userId, userPassword, userEmail } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(userPassword, 10);
        await db.execute(
            'INSERT INTO member (userId, userPassword, userEmail) VALUES (?, ?, ?)',
            [userId, hashedPassword, userEmail]
        );
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        res.render('auth/register', { title: '회원가입', error: '이미 존재하는 아이디이거나 오류가 발생했습니다.' });
    }
});

// Login Page

// Login Process

// Logout

module.exports = router;