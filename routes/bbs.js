const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises; // 프로미스 기반의 fs 모듈

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadPath = 'public/uploads/';
        
        try {
            // 폴더가 있는지 확인하고, 없으면 생성 (recursive 옵션 포함)
            // access는 폴더 존재 여부를 체크하며, 에러가 나면 catch 문으로 이동합니다.
            await fs.access(uploadPath);
        } catch (error) {
            // 폴더가 없는 경우 생성
            await fs.mkdir(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // 고유한 파일명 생성
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${extension}`);
    }
});


const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Middleware to check if logged in
function checkLoggedIn(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/auth/login');
    }
}

// List

// Write Page
router.get('/write', checkLoggedIn, (req, res) => {
    const code = req.query.code || 'FREE';
    // Access control for NOTICE
    if (code === 'NOTICE' && req.session.user.userId !== 'admin') {
        return res.status(403).send('관리자만 공지사항을 작성할 수 있습니다.');
    }
    res.render('bbs/write', { title: '글쓰기', code });
});

// Write Process

// Image Upload API for Summernote

// View Page

// Edit Page

// Edit Process

// Delete Process

module.exports = router;


