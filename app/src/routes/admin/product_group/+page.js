import { back_api } from "$lib/const.js";
import axios from "axios";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {

    let product_groups = [];
    try {
        const res = await axios.get(`${back_api}/admin/get_product_groups`)
        product_groups = res.data.product_groups;

    } catch (error) {

    }
    return { product_groups }
}