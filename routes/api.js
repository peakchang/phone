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
    })
})

// 폴더 존재 여부 확인 및 생성
const ensureDirectoryExistence = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};


apiRouter.post('/img_upload_set', img_upload_set.single('onimg'), (req, res, next) => {
    let saveUrl = ""
    saveUrl = `/img/${req.body.folder}/${req.file.originalname}`
    console.log(saveUrl);
    
    res.json({ saveUrl })
})

export { apiRouter }