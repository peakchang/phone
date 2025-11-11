import { back_api } from "$lib/const.js";
import axios from "axios";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {

    let plan_groups = [];
    try {
        const res = await axios.get(`${back_api}/admin/get_plan_groups`)
        plan_groups = res.data.plan_groups;

    } catch (error) {

    }
    return { plan_groups }
}