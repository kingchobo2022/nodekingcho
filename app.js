require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// View Globals
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Routes
const authRouter = require('./routes/auth');
const bbsRouter = require('./routes/bbs');
const memberRouter = require('./routes/member');

app.use('/auth', authRouter);
app.use('/bbs', bbsRouter);
app.use('/member', memberRouter);

app.get('/', (req, res) => {
    res.render('index', { title: '왕초뮤니티 - 홈' });
});

app.get('/intro', (req, res) => {
    res.render('intro', { title: '커뮤니티 소개' });
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




