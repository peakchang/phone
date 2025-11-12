<script>
    import { onMount } from "svelte";
    import { back_api, carriers, networkTypes } from "$lib/const";
    import { invalidateAll } from "$app/navigation";
    import axios from "axios";

    let { data } = $props();

    let plans = $state([]); // 전체 요금제 데이터
    let planGroups = $state([]); // 전체 요금제 그룹 데이터
    let filterPlanGroups = $state([]); // 필터링된 요금제 그룹 데이터

    onMount(() => {
        planGroups = data.plan_groups;
        filterPlanGroups = planGroups.filter(
            (group) =>
                group.carrier === carrier &&
                group.network_type === network_type,
        );
    });

    $effect(() => {
        plans = data.plans;
    });

    let carrier = $state("SKT");
    let network_type = $state("5G");

    let actButton = $state("create");

    // 업로드 및 업데이트 할 변수들
    let id = $state(0);
    let group_id = $state("");
    let name = $state("");
    let price = $state(0);
    let voice = $state("");
    let usedata = $state("");
    let sms = $state("");
    let benefits = $state("");

    // 모달에서 통신사 및 통신 방식 변경 시 filterPlanGroup 배열 만들어주는 함수1
    function getFilterGroup() {
        filterPlanGroups = planGroups.filter(
            (group) =>
                group.carrier === carrier &&
                group.network_type === network_type,
        );
        console.log(filterPlanGroups);
    }

    async function upsert_plan_act() {
        if (!group_id) {
            alert("그룹이 선택되지 않았습니다.");
            return;
        } else if (!name) {
            alert("요금제명이 입력되지 않았습니다.");
            return;
        } else if (!price) {
            alert("가격이 입력되지 않았습니다.");
            return;
        }

        const type = this.value;
        if (type == "upload") {
            try {
                const res = await axios.post(
                    `${back_api}/admin/plans_upload_update`,
                    {
                        type,
                        group_id,
                        name,
                        price,
                        voice,
                        usedata,
                        sms,
                        benefits,
                    },
                );
                alert("요금제가 추가되었습니다.");
                invalidateAll();
            } catch (error) {
                console.error(error.response.data.error);
                const message = error.response.data.error;
                alert(message);
            }
        } else {
            try {
                const res = await axios.post(
                    `${back_api}/admin/plans_upload_update`,
                    {
                        id,
                        type,
                        group_id,
                        name,
                        price,
                        voice,
                        usedata,
                        sms,
                        benefits,
                    },
                );
                alert("요금제 수정이 완료 되었습니다.");
                invalidateAll();
            } catch (error) {
                const message = error.response.data.error;
                alert(message);
            }
        }
    }

    function update_modal_open() {
        console.log(plans[this.value]);

        actButton = "update";

        id = plans[this.value].id;
        group_id = plans[this.value].group_id;
        name = plans[this.value].name;
        price = plans[this.value].price;
        voice = plans[this.value].voice;
        usedata = plans[this.value].usedata;
        sms = plans[this.value].sms;
        benefits = plans[this.value].benefits;

        add_plan_modal.showModal();
    }

    async function sortFunc() {
        console.log(this.value);
        console.log(this.dataset.idx);

        let originData = {};
        let changeData = {};

        if (this.value === "up") {
            originData = plans[this.dataset.idx];
            changeData = plans[Number(this.dataset.idx) + 1];
        } else {
            originData = plans[this.dataset.idx];
            changeData = plans[Number(this.dataset.idx) - 1];
        }

        if (!originData || !changeData) {
            alert("더이상 이동할수 없습니다.");
            return;
        }

        console.log(originData.id);
        console.log(originData.plan_sort_order);
        console.log(changeData.id);
        console.log(changeData.plan_sort_order);

        console.log("???");

        try {
            const res = await axios.post(`${back_api}/admin/plans_sort`, {
                origin_id: originData.id,
                origin_sort: originData.plan_sort_order,
                change_id: changeData.id,
                change_sort: changeData.plan_sort_order,
            });
            invalidateAll();
        } catch (error) {
            alert("정렬 변경에 실패하였습니다.");
        }
    }

    async function deletePlan() {
        console.log(this.value);
        let confirm_check = confirm("정말 요금제를 삭제하시겠습니까?");
        if (!confirm_check) {
            return;
        }
        try {
            const res = await axios.post(
                `${back_api}/admin/plan_delete`,
                {
                    id: this.value,
                },
            );
            alert("요금제 그룹이 삭제되었습니다.");
            invalidateAll();
        } catch (error) {
            alert("요금제 그룹 삭제에 실패하였습니다.");
        }
    }
</script>

<!-- svelte-ignore event_directive_deprecated -->
<dialog class="modal" id="add_plan_modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">요금제 추가</h3>

        <div class="mt-5">
            <table class="w-full">
                <tbody>
                    <tr>
                        <th class="tb_th">통신사</th>
                        <td class="tb_td">
                            <select
                                bind:value={carrier}
                                class="w-full input-box"
                                on:change={getFilterGroup}
                            >
                                {#each carriers as carrier_option}
                                    <option value={carrier_option}
                                        >{carrier_option}</option
                                    >
                                {/each}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th class="tb_th">통신방식</th>
                        <td class="tb_td">
                            <select
                                bind:value={network_type}
                                class="w-full input-box"
                                on:change={getFilterGroup}
                            >
                                {#each networkTypes as networkTypes_option}
                                    <option value={networkTypes_option}>
                                        {networkTypes_option}
                                    </option>
                                {/each}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th class="tb_th">그룹</th>
                        <td class="tb_td">
                            <select
                                bind:value={group_id}
                                class="w-full input-box"
                            >
                                {#each filterPlanGroups as groupData}
                                    <option value={groupData.id}>
                                        {groupData.name}
                                    </option>
                                {/each}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th class="tb_th">요금제명</th>
                        <td class="tb_td">
                            <input
                                type="text"
                                class="w-full input-box"
                                bind:value={name}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th class="tb_th">가격 (숫자만)</th>
                        <td class="tb_td">
                            <input
                                type="text"
                                class="w-full input-box"
                                bind:value={price}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th class="tb_th">음성</th>
                        <td class="tb_td">
                            <input
                                type="text"
                                class="w-full input-box"
                                bind:value={voice}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th class="tb_th">데이터</th>
                        <td class="tb_td">
                            <input
                                type="text"
                                class="w-full input-box"
                                bind:value={usedata}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th class="tb_th">문자</th>
                        <td class="tb_td">
                            <input
                                type="text"
                                class="w-full input-box"
                                bind:value={sms}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th class="tb_th">특이점</th>
                        <td class="tb_td">
                            <input
                                type="text"
                                class="w-full input-box"
                                bind:value={benefits}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="modal-action">
            <form method="dialog">
                {#if actButton === "create"}
                    <button
                        class="btn btn-outline btn-primary"
                        value="upload"
                        on:click={upsert_plan_act}
                    >
                        추가
                    </button>
                {:else}
                    <button
                        class="btn btn-outline btn-primary"
                        value="update"
                        on:click={upsert_plan_act}
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
            group_id = 0;
            name = "";
            price = "";
            voice = "";
            usedata = "";
            sms = "";
            benefits = "";
            actButton = "create";
            add_plan_modal.showModal();
        }}
    >
        요금제 추가
    </button>
</div>
<!-- svelte-ignore event_directive_deprecated -->
<!-- svelte-ignore a11y_consider_explicit_label -->
<div>
    <table class="w-full">
        <thead>
            <tr>
                <th class="tb_th">
                    <input
                        type="checkbox"
                        class="checkbox checkbox-sm bg-white checked:bg-white"
                    />
                </th>
                <th class="tb_th">버튼</th>
                <th class="tb_th">통신사</th>
                <th class="tb_th">통신방식</th>
                <th class="tb_th">그룹</th>
                <th class="tb_th w-[110px]">요금제명</th>
                <th class="tb_th">기본료</th>
                <th class="tb_th">통화</th>
                <th class="tb_th">데이터</th>
                <th class="tb_th">문자</th>
                <th class="tb_th">특이점</th>
            </tr>
        </thead>
        <tbody>
            {#each plans as planData, idx}
                <tr>
                    <td class="border border-gray-300 text-center w-[50px]">
                        <div class="flex items-center justify-center">
                            <input
                                type="checkbox"
                                class="checkbox checkbox-sm"
                            />
                        </div>
                    </td>
                    <td class="tb_td">
                        <div class="flex justify-center items-center gap-1.5">
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
                                value={planData.id}
                                on:click={deletePlan}
                            >
                                <i class="fa fa-times-circle" aria-hidden="true"
                                ></i>
                            </button>
                        </div>
                    </td>

                    <td class="tb_td">{planData.carrier}</td>
                    <td class="tb_td">{planData.network_type}</td>
                    <td class="tb_td">{planData.group_name}</td>
                    <td class="tb_td">{planData.name}</td>
                    <td class="tb_td">{planData.price}</td>
                    <td class="tb_td">
                        <div class="w-[190px]">
                            {planData.voice}
                        </div>
                    </td>
                    <td class="tb_td">{planData.usedata}</td>
                    <td class="tb_td">{planData.sms}</td>
                    <td class="tb_td">
                        <div class="max-w-[500px] truncate mx-auto">
                            {planData.benefits}
                        </div>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
