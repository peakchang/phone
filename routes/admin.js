import express from "express";
import moment from "moment-timezone";
import bcrypt from "bcrypt";
import { sql_con } from '../back-lib/db.js'
import { getQueryStr } from '../back-lib/lib.js'

const admRouter = express.Router();

// 그룹 업로드 (create)
admRouter.post('/plans_groups_upload', async (req, res) => {

    const body = req.body;

    try {
        const queryStr = getQueryStr(body, 'insert', 'created_at');
        console.log(queryStr);
        const insertPlanGroupQuery = `INSERT INTO plan_groups (${queryStr.str}) VALUES (${queryStr.question})`;
        const [insertResult] = await sql_con.promise().query(insertPlanGroupQuery, queryStr.values);
        console.log(insertResult);
        res.status(200).json({})
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error.message);
    }

    console.log(body);


    res.json({})
})

admRouter.use('/get_plan_groups', async (req, res) => {

    console.log('그룹 불러오기 진입!!!!!!!!!');

    let plan_groups = [];

    try {
        const getPlanGroupsQuery = `SELECT * FROM plan_groups ORDER BY id DESC`;
        const [planGroups] = await sql_con.promise().query(getPlanGroupsQuery);
        console.log(planGroups);


        plan_groups = planGroups;

    } catch (error) {
        console.error(error.message);

    }

    res.status(200).json({ plan_groups })
})


export { admRouter }