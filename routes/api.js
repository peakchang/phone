import express from "express";
import multer from "multer";
import moment from "moment-timezone";
import fs from "fs";
import path from "path";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const apiRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 폴더 존재 여부 확인 및 생성
const ensureDirectoryExistence = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

// Multer 설정 (단일 및 다중 모두 사용)
let img_upload_set = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const folder = req.body.folder || 'default';
            console.log(__dirname);
            console.log(folder);
            const uploadPath = path.join(__dirname, '..', 'public', 'uploads', 'image', folder);
            console.log(uploadPath);

            ensureDirectoryExistence(uploadPath);
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB 제한
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('이미지 파일만 업로드 가능합니다.'));
    }
});

// ✅ 단일 이미지 업로드
apiRouter.post('/img_upload_set', img_upload_set.single('onimg'), (req, res, next) => {
    console.log('단일 이미지 업로드 진입');

    try {
        if (!req.file) {
            return res.status(400).json({ error: '파일이 없습니다.' });
        }

        let saveUrl = `/img/${req.body.folder}/${req.file.originalname}`;
        console.log(saveUrl);

        res.json({
            message: '업로드 성공',
            saveUrl
        });
    } catch (error) {
        console.error('업로드 에러:', error);
        res.status(500).json({ error: '업로드 실패' });
    }
});

// ✅ 다중 이미지 업로드
apiRouter.post('/img_upload_multiple', img_upload_set.array('onimg', 10), (req, res, next) => {
    console.log('다중 이미지 업로드 진입');

    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: '파일이 없습니다.' });
        }

        const folder = req.body.folder || 'default';

        // 업로드된 모든 파일의 URL 생성
        const files = req.files.map(file => ({
            saveUrl: `/img/${folder}/${file.originalname}`,
            originalName: file.originalname,
            size: file.size,
            mimetype: file.mimetype
        }));

        console.log(`${files.length}개 파일 업로드 완료`);

        res.json({
            message: '업로드 성공',
            files: files,
            count: files.length
        });
    } catch (error) {
        console.error('업로드 에러:', error);
        res.status(500).json({ error: '업로드 실패' });
    }
});



apiRouter.post('/delete_sort_img', async (req, res, next) => {

    const body = req.body;
    const delPath = `public/uploads/image/${body.delFolder}/${body.delFile}`

    try {
        await fs.unlink(delPath, (err) => {
            console.error(err);
        })
    } catch (error) {
        console.error(error);
    }
    res.json({})
})


export { apiRouter }