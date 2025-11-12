import express from "express";
import moment from "moment-timezone";
import bcrypt from "bcrypt";
import { sql_con } from '../back-lib/db.js'
import { getQueryStr } from '../back-lib/lib.js'

const admRouter = express.Router();

// ------------------------------------ 플랜 그룹 관리 ------------------------------------ //

// 그룹 업로드 / 업데이트 (create / update)
admRouter.post('/plans_groups_upload_update', async (req, res) => {

    const body = req.body;

    try {
        if (body.type == 'upload') {
            delete body.type;
            const queryStr = getQueryStr(body, 'insert', 'created_at');
            const insertPlanGroupQuery = `INSERT INTO plan_groups (${queryStr.str}) VALUES (${queryStr.question})`;
            await sql_con.promise().query(insertPlanGroupQuery, queryStr.values);
        } else {
            delete body.type;
            const queryStr = getQueryStr(body, 'update', 'updated_at');
            const updatePlanGroupQuery = `UPDATE plan_groups SET ${queryStr.str} WHERE id = ?`;
            console.log(updatePlanGroupQuery);

            queryStr.values.push(body.id);
            console.log(queryStr.values);
            await sql_con.promise().query(updatePlanGroupQuery, queryStr.values);
        }

        res.status(200).json({})
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error.message);
    }

    console.log(body);
})

// 그룹 불러오기 (read)
admRouter.use('/get_plan_groups', async (req, res) => {

    let plan_groups = [];

    try {
        const getPlanGroupsQuery = `SELECT * FROM plan_groups ORDER BY sort_order ASC`;
        const [planGroups] = await sql_con.promise().query(getPlanGroupsQuery);
        plan_groups = planGroups;
        res.status(200).json({ plan_groups })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
})


admRouter.use('/plan_groups_sort', async (req, res) => {

    const body = req.body;

    try {
        const originMakeZeroQuery = "UPDATE plan_groups SET sort_order = 0 WHERE id = ?";
        await sql_con.promise().query(originMakeZeroQuery, [body.origin_id]);

        const changeSortQuery = "UPDATE plan_groups SET sort_order = ? WHERE id = ?";
        await sql_con.promise().query(changeSortQuery, [body.origin_sort, body.change_id]);

        const originSortQuery = "UPDATE plan_groups SET sort_order = ? WHERE id = ?";
        await sql_con.promise().query(originSortQuery, [body.change_sort, body.origin_id]);
        res.status(200).json({})

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }


})

admRouter.use('/plan_groups_delete', async (req, res) => {

    const { id } = req.body;

    try {
        const deletePlanGroupQuery = "DELETE FROM plan_groups WHERE id = ?";
        await sql_con.promise().query(deletePlanGroupQuery, [id]);
        res.status(200).json({})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }


})




export { admRouter }