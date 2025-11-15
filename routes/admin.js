import express from "express";
import moment from "moment-timezone";
import bcrypt from "bcrypt";
import { sql_con } from '../back-lib/db.js'
import { getQueryStr } from '../back-lib/lib.js'

const admRouter = express.Router();

// ------------------------------------ 플랜(요금제) 그룹 관리 ------------------------------------ //


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


// ------------------------------------ 플랜(요금제) 관리 ------------------------------------ //

admRouter.use('/get_plan', async (req, res) => {

    let plans = [];
    let plan_groups = [];

    try {
        const getPlansQuery = `SELECT
            p.id,
            p.group_id,
            p.name,
            p.price,
            p.voice,
            p.usedata,
            p.sms,
            p.benefits,
            p.sort_order AS plan_sort_order,
            p.created_at,
            p.updated_at,
            g.carrier,
            g.network_type,
            g.name AS group_name,
            g.sort_order AS group_sort_order
            FROM plans AS p
            JOIN plan_groups AS g
            ON g.id = p.group_id
        ORDER BY p.sort_order ASC`;

        // -- WHERE g.carrier = 'SKT' AND g.network_type = '5G' (ORDER 윗줄)
        const [planRows] = await sql_con.promise().query(getPlansQuery);
        plans = planRows;
        console.log(plans);


        const getPlanGroupsQuery = `SELECT * FROM plan_groups ORDER BY sort_order ASC`;
        const [planGroupRows] = await sql_con.promise().query(getPlanGroupsQuery);
        plan_groups = planGroupRows;

        res.status(200).json({ plans, plan_groups })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
})


admRouter.post('/plans_upload_update', async (req, res) => {

    const body = req.body;

    try {
        if (body.type == 'upload') {
            console.log('업로드 들어옴~~');

            delete body.type;
            const queryStr = getQueryStr(body, 'insert', 'created_at');
            const insertPlanGroupQuery = `INSERT INTO plans (${queryStr.str}) VALUES (${queryStr.question})`;
            await sql_con.promise().query(insertPlanGroupQuery, queryStr.values);
        } else {
            delete body.type;
            const queryStr = getQueryStr(body, 'update', 'updated_at');
            const updatePlanGroupQuery = `UPDATE plans SET ${queryStr.str} WHERE id = ?`;
            console.log(updatePlanGroupQuery);

            queryStr.values.push(body.id);
            console.log(queryStr.values);
            await sql_con.promise().query(updatePlanGroupQuery, queryStr.values);
        }

        res.status(200).json({})
    } catch (error) {

        let errMessage = ""
        if (error.message.includes('price')) {
            errMessage = "가격은 숫자만 입력 해야 합니다."
        } else {
            errMessage = "요금제 그룹과 요금제명은 중복 될 수 없습니다."
        }
        res.status(500).json({ error: errMessage });
        console.error(error.message);
    }

    console.log(body);
})

// admRouter.use('/plans_sort', async (req, res) => {
//     const body = req.body;
//     try {
//         const originMakeZeroQuery = "UPDATE plans SET sort_order = 0 WHERE id = ?";
//         await sql_con.promise().query(originMakeZeroQuery, [body.origin_id]);
//         const changeSortQuery = "UPDATE plans SET sort_order = ? WHERE id = ?";
//         await sql_con.promise().query(changeSortQuery, [body.origin_sort, body.change_id]);
//         const originSortQuery = "UPDATE plans SET sort_order = ? WHERE id = ?";
//         await sql_con.promise().query(originSortQuery, [body.change_sort, body.origin_id]);
//         res.status(200).json({})
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ error: error.message });
//     }
// })

admRouter.use('/plan_delete', async (req, res) => {

    const { id } = req.body;

    try {
        const deletePlanQuery = "DELETE FROM plans WHERE id = ?";
        await sql_con.promise().query(deletePlanQuery, [id]);
        res.status(200).json({})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
})


// ------------------------------------ 상품 그룹 관리 ------------------------------------ //

// 그룹 불러오기 (read)
admRouter.use('/get_product_groups', async (req, res) => {
    console.log('잘 안들어올거야?!?!??!');

    let product_groups = [];

    try {

        const getProductGroupsQuery = `SELECT * FROM product_groups ORDER BY sort_order ASC`;
        const [productGroups] = await sql_con.promise().query(getProductGroupsQuery);
        product_groups = productGroups;
        res.status(200).json({ product_groups })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
})

// 그룹 업로드 / 업데이트 (create / update)
admRouter.post('/product_groups_upsert', async (req, res) => {

    console.log('여기는 어디이이이이이이이이이?!?!??!?!?!?!????!!!');

    const body = req.body;

    try {
        if (body.type == 'upload') {
            delete body.type;
            const queryStr = getQueryStr(body, 'insert');
            const insertPlanGroupQuery = `INSERT INTO product_groups (${queryStr.str}) VALUES (${queryStr.question})`;
            await sql_con.promise().query(insertPlanGroupQuery, queryStr.values);
        } else {
            delete body.type;
            const queryStr = getQueryStr(body, 'update');
            const updatePlanGroupQuery = `UPDATE product_groups SET ${queryStr.str} WHERE id = ?`;
            console.log(updatePlanGroupQuery);

            queryStr.values.push(body.id);
            console.log(queryStr.values);
            await sql_con.promise().query(updatePlanGroupQuery, queryStr.values);
        }

        res.status(200).json({})
    } catch (error) {
        console.error(error.message);
        let errMessage = "메뉴 추가가 실패 했습니다. 다시 시도해주세요."
        res.status(500).json({ error: errMessage });

    }

    console.log(body);
})

// ------------------------------------ 상품 관리 ------------------------------------ //

admRouter.use('/get_product', async (req, res) => {

    let product = [];
    let product_groups = [];

    try {
        const getProductGroupsQuery = `SELECT * FROM plan_groups ORDER BY sort_order ASC`;
        const [productGroupRows] = await sql_con.promise().query(getProductGroupsQuery);
        plan_groups = productGroupRows;

        res.status(200).json({ product, product_groups })
    } catch (error) {
        console.error(error.message);
    }
})

// ------------------------------------ 공통 ------------------------------------ //

admRouter.use('/sort', async (req, res) => {
    const body = req.body;
    try {
        const originMakeZeroQuery = `UPDATE ${body.table} SET sort_order = 0 WHERE id = ?`;
        await sql_con.promise().query(originMakeZeroQuery, [body.origin_id]);

        const changeSortQuery = `UPDATE ${body.table} SET sort_order = ? WHERE id = ?`;
        await sql_con.promise().query(changeSortQuery, [body.origin_sort, body.change_id]);

        const originSortQuery = `UPDATE ${body.table} SET sort_order = ? WHERE id = ?`;
        await sql_con.promise().query(originSortQuery, [body.change_sort, body.origin_id]);
        res.status(200).json({})

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
})


export { admRouter }