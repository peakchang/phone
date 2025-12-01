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

            queryStr.values.push(body.id);
            await sql_con.promise().query(updatePlanGroupQuery, queryStr.values);
        }

        res.status(200).json({})
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error.message);
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
            delete body.type;
            const queryStr = getQueryStr(body, 'insert', 'created_at');
            const insertPlanGroupQuery = `INSERT INTO plans (${queryStr.str}) VALUES (${queryStr.question})`;
            await sql_con.promise().query(insertPlanGroupQuery, queryStr.values);
        } else {
            delete body.type;
            const queryStr = getQueryStr(body, 'update', 'updated_at');
            const updatePlanGroupQuery = `UPDATE plans SET ${queryStr.str} WHERE id = ?`;
            queryStr.values.push(body.id);
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

            queryStr.values.push(body.id);
            await sql_con.promise().query(updatePlanGroupQuery, queryStr.values);
        }

        res.status(200).json({})
    } catch (error) {
        console.error(error.message);
        let errMessage = "메뉴 추가가 실패 했습니다. 다시 시도해주세요."
        res.status(500).json({ error: errMessage });

    }
})

// ------------------------------------ 상품 관리 ------------------------------------ //

admRouter.use('/get_plans', async (req, res) => {

    const { carrier } = req.body;


    let planArrangeList = []

    try {
        const getPlanGroupsQuery = "SELECT * FROM plan_groups WHERE carrier = ? ORDER BY sort_order ASC;";
        const [planGroupRows] = await sql_con.promise().query(getPlanGroupsQuery, [carrier]);

        for (let i = 0; i < planGroupRows.length; i++) {
            const planGroup = planGroupRows[i];

            try {
                const getPlanQuery = "SELECT * FROM plans WHERE group_id = ? ORDER BY sort_order ASC;"
                const [planRows] = await sql_con.promise().query(getPlanQuery, [planGroup.id]);

                if (planRows.length > 0) {
                    const planObjTemp = {
                        id: planGroup.id,
                        name: planGroup.name,
                        network_type: planGroup.network_type,
                        sort_order: planGroup.sort_order,
                        plans: planRows
                    }
                    planArrangeList.push(planObjTemp)
                }

            } catch (error) {

            }

        }

        if (planArrangeList.length == 0) {
            return res.status(500).json({ message: "요금제가 없습니다. 요금제를 추가해 주세요." })
        }

        return res.status(200).json({ planArrangeList })

    } catch (error) {
        return res.status(500).json({ message: "에러 발생! 다시 시도해 주세요." })
    }


})


admRouter.use('/get_product', async (req, res) => {

    let products = [];
    let product_groups = [];

    try {
        const getProductGroupsQuery = `SELECT * FROM product_groups ORDER BY sort_order ASC`;
        const [productGroupRows] = await sql_con.promise().query(getProductGroupsQuery);
        product_groups = productGroupRows;

        const getProductQuery = `SELECT p.*,
        GROUP_CONCAT(pg.name ORDER BY pg.id SEPARATOR ',') AS product_group_names
        FROM products p
        LEFT JOIN product_groups pg
        ON FIND_IN_SET(pg.id, p.product_groups)
        
        GROUP BY p.id
        ORDER BY sort_order ASC
        ;`

        const [productRows] = await sql_con.promise().query(getProductQuery);
        products = productRows
        res.status(200).json({ products, product_groups })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({})
    }
})


admRouter.post('/upsert_product', async (req, res) => {

    const body = req.body;

    console.log(body.type);

    if (body.type == "upload") {

        delete body.type;
        const queryStr = getQueryStr(body, 'insert', 'created_at');
        const insertProductQuery = `INSERT INTO products (${queryStr.str}) VALUES (${queryStr.question})`;
        await sql_con.promise().query(insertProductQuery, queryStr.values);

    } else {

        const getIdx = body.id;
        delete body.type;
        delete body.id;
        delete body.updated_at;
        delete body.product_group_names;
        delete body.created_at;
        delete body.updated_at;

        const queryStr = getQueryStr(body, 'update', 'updated_at');
        queryStr.values.push(getIdx)
        const updateProductQuery = `UPDATE products SET ${queryStr.str} WHERE id = ?`
        await sql_con.promise().query(updateProductQuery, queryStr.values);

    }

    res.json({})
})

admRouter.post('/update_plans', async (req, res) => {

    const body = req.body;
    const planIdList = body.planData.join(',')

    try {
        const updatePlansQuery = `UPDATE products SET ${body.carrier}_plans = ? WHERE id = ?`
        await sql_con.promise().query(updatePlansQuery, [planIdList, body.productId]);
    } catch (error) {

    }

    res.json({})
})

admRouter.post('/update_detail', async (req, res) => {
    const body = req.body;

    console.log(body);
    
    try {
        const updateDetailQuery = `UPDATE products SET ${body.carrier}_public_subsidy = '${body[`${body.carrier}_public_subsidy`]}', ${body.carrier}_discount_json = '${body[`${body.carrier}_discount_json`]}'  WHERE id = ?`

        console.log(updateDetailQuery);


        await sql_con.promise().query(updateDetailQuery, [body.id]);
    } catch (error) {
        console.error(error.message);

    }

    res.json({})
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