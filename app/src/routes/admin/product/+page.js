import { back_api } from "$lib/const.js";
import axios from "axios";

// 사이트 접속시 user_info store 값에 user 정보 넣기
export const load = async ({ params, url, data }) => {

    let product_groups = [];
    let product = [];
    try {
        const res = await axios.get(`${back_api}/admin/get_product`)
        product_groups = res.data.product_groups;
        product = res.data.product;

        console.log(product_groups);
        console.log(product);



    } catch (error) {

    }
    return { product_groups, product }
}