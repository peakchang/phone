<script>
    import OneImgUpload from "$lib/components/OneImgUpload.svelte";
    import { origin_url } from "$lib/const";
    import axios from "axios";
    import { back_api } from "$lib/const";
    import { invalidateAll } from "$app/navigation";

    // 출력될 변수!!
    let product_groups = $state([]);

    // 입력 될 항목 변수들
    let id = $state(0);
    let name = $state("");
    let description = $state("");
    let img_url = $state("");

    // 버튼 action 변수
    let actButton = $state("upload");

    let { data } = $props();

    function imgAct(e) {
        img_url = e.detail.imgPath;
    }

    $effect(() => {
        product_groups = data.product_groups;
    });

    async function upload_product_group() {
        console.log(this.value);
        const type = this.value;
        console.log(name, description, img_url);
        if (!name) {
            alert("그룹명(메뉴명) 값이 필요합니다.");
            return;
        }

        if (type == "upload") {
            console.log("안들어와?!");

            try {
                const res = await axios.post(
                    `${back_api}/admin/product_groups_upsert`,
                    {
                        type,
                        name,
                        description,
                        img_url,
                    },
                );
                alert("상품 그룹이 추가되었습니다.");
                invalidateAll();
            } catch (error) {
                console.error(error.message);
                const message = error.response.data.error;
                alert(message);
            }
        } else {
            try {
                const res = await axios.post(
                    `${back_api}/admin/product_groups_upsert`,
                    {
                        id,
                        type,
                        name,
                        description,
                        img_url,
                    },
                );
                alert("상품 그룹 수정이 완료 되었습니다.");
                invalidateAll();
            } catch (error) {
                const message = error.response.data.error;
                alert(message);
            }
        }
    }

    function update_modal_open() {
        actButton = "update";

        id = product_groups[this.value].id;
        name = product_groups[this.value].name;
        description = product_groups[this.value].description;
        img_url = product_groups[this.value].img_url;

        add_product_group_modal.showModal();
    }

    function deleteProductGroup() {}

    async function sortFunc() {
        console.log(this.value);
        console.log(this.dataset.idx);

        let originData = {};
        let changeData = {};

        if (this.value === "up") {
            originData = product_groups[this.dataset.idx];
            changeData = product_groups[Number(this.dataset.idx) + 1];
        } else {
            originData = product_groups[this.dataset.idx];
            changeData = product_groups[Number(this.dataset.idx) - 1];
        }
        
        if (!originData || !changeData) {
            alert("더이상 이동할수 없습니다.");
            return;
        }

        try {
            const table = "product_groups";
            const res = await axios.post(`${back_api}/admin/sort`, {
                table,
                origin_id: originData.id,
                origin_sort: originData.sort_order,
                change_id: changeData.id,
                change_sort: changeData.sort_order,
            });
            invalidateAll();
        } catch (error) {
            alert("정렬 변경에 실패하였습니다.");
        }
    }
</script>

<dialog class="modal" id="add_product_group_modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">상품 그룹 (메뉴) 추가</h3>

        <div class="mt-5">
            <table class="w-full">
                <tbody>
                    <tr>
                        <th class="tb_th">그룹명(메뉴명)</th>
                        <td class="tb_td">
                            <input
                                type="text"
                                class="w-full input-box"
                                bind:value={name}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th class="tb_th">메뉴 설명</th>
                        <td class="tb_td">
                            <input
                                type="text"
                                class="w-full input-box"
                                bind:value={description}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th class="tb_th">이미지</th>
                        <td class="tb_td">
                            {#if img_url}
                                <div>
                                    <img src="{origin_url}{img_url}" alt="" />
                                </div>
                            {/if}
                            <OneImgUpload
                                on:sendImgPath={imgAct}
                                domainFolder="phone_img"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="modal-action">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <!-- svelte-ignore event_directive_deprecated -->
                {#if actButton === "upload"}
                    <button
                        class="btn btn-outline btn-primary"
                        value="upload"
                        on:click={upload_product_group}
                    >
                        추가
                    </button>
                {:else}
                    <button
                        class="btn btn-outline btn-primary"
                        value="update"
                        on:click={upload_product_group}
                    >
                        수정
                    </button>
                {/if}
                <button class="btn">닫기</button>
            </form>
        </div>
    </div>
</dialog>

<div class="mb-5">
    <!-- svelte-ignore event_directive_deprecated -->
    <button
        class="btn btn-primary btn-sm"
        on:click={() => {
            add_product_group_modal.showModal();
        }}
    >
        상품 그룹 (메뉴) 추가
    </button>
</div>

<div>
    <table class="w-full">
        <thead>
            <tr>
                <th class="tb_th w-[25%]">메뉴명</th>
                <th class="tb_th w-[35%]">메뉴 설명</th>
                <th class="tb_th w-[40%]">이미지</th>
                <th class="tb_th" style="width: 200px;">버튼</th>
            </tr>
        </thead>
        <tbody>
            {#each product_groups as productData, idx}
                <tr>
                    <td class="tb_td">
                        {productData.name}
                    </td>
                    <td class="tb_td w-[35%]">
                        {productData.description}
                    </td>
                    <td class="tb_td">
                        <div class="max-w-[240px] mx-auto">
                            <img
                                src="{origin_url}{productData.img_url}"
                                alt=""
                            />
                        </div>
                    </td>
                    <td class="tb_td" style="width: 200px; padding: 10px 20px">
                        <!-- svelte-ignore element_implicitly_closed -->
                        <!-- svelte-ignore event_directive_deprecated -->
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <div class="flex justify-center items-center gap-2">
                            <button
                                class="btn btn-info btn-xs text-white"
                                value={idx}
                                on:click={update_modal_open}
                            >
                                수정
                            </button>

                            <button
                                class="text-xl text-red-400 cursor-pointer"
                                value="down"
                                data-idx={idx}
                                on:click={sortFunc}
                            >
                                <i
                                    class="fa fa-chevron-circle-up"
                                    aria-hidden="true"
                                ></i>
                            </button>
                            <button
                                class="text-xl text-red-400 cursor-pointer"
                                value="up"
                                data-idx={idx}
                                on:click={sortFunc}
                            >
                                <i
                                    class="fa fa-chevron-circle-down"
                                    aria-hidden="true"
                                ></i>
                            </button>

                            <button
                                class="text-xl text-red-400 cursor-pointer"
                                value={productData.id}
                                on:click={deleteProductGroup}
                            >
                                <i class="fa fa-times-circle" aria-hidden="true"
                                ></i>
                            </button>
                        </div>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
