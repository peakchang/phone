import { back_api } from "$lib/const.js";
import axios from "axios";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {

    let plan_groups = [];
    let plans = [];
    try {
        const res = await axios.get(`${back_api}/admin/get_plan`)
        plan_groups = res.data.plan_groups;
        plans = res.data.plans;

        console.log(plan_groups);
        console.log(plans);
        
        

    } catch (error) {

    }
    return { plan_groups, plans }
}