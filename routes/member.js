const express = require('express');
const router = express.Router();

// Middleware to check if logged in
function checkLoggedIn(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/auth/login');
    }
}

router.get('/benefits', checkLoggedIn, (req, res) => {
    res.render('member/benefits', { title: '커뮤니티 혜택' });
});

module.exports = router;
