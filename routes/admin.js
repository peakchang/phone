import express from "express";
import moment from "moment-timezone";
import bcrypt from "bcrypt";
import { sql_con } from '../back-lib/db.js'

const admRouter = express.Router();

// 여러 키워드 업로드
admRouter.post('/plans_groups_upload', async (req, res) => {

    const body = req.body;

    console.log(body);
    

    res.json({  })
})

export { admRouter }