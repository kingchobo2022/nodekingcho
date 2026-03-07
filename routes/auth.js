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
router.get('/login', (req, res) => {
    res.render('auth/login', { title: '로그인' });
});

// Login Process
router.post('/login', async (req, res) => {
    const { userId, userPassword } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM member WHERE userId = ?', [userId]);
        if (rows.length > 0) {
            const match = await bcrypt.compare(userPassword, rows[0].userPassword);
            if (match) {
                req.session.user = {
                    id: rows[0].id,
                    userId: rows[0].userId,
                    userEmail: rows[0].userEmail
                };
                return res.redirect('/');
            }
        }
        res.render('auth/login', { title: '로그인', error: '아이디 또는 비밀번호가 틀렸습니다.' });
    } catch (err) {
        console.error(err);
        res.render('auth/login', { title: '로그인', error: '오류가 발생했습니다.' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;