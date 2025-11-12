<script>
    import axios from "axios";
    import { back_api } from "$lib/const";
    import { invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";

    const carriers = ["SKT", "KT", "LGU"];
    const networkTypes = ["5G", "LTE"];

    // 출력될 변수!!
    let plans_groups = $state([]);

    // 입력 될 항목 변수들
    let id = $state("");
    let carrier = $state("SKT");
    let network_type = $state("5G");
    let name = $state("");
    let info = $state("");

    // action 변수
    let actButton = $state("create");

    let { data } = $props();

    $effect(() => {
        plans_groups = data.plan_groups;
    });

    // onMount(() => {
    //     plans_groups = data.plan_groups;
    //     console.log(plans_groups);
    // });

    // create
    async function upload_plan_groups() {
        let type = "upload";
        try {
            const res = await axios.post(
                `${back_api}/admin/plans_groups_upload_update`,
                {
                    carrier,
                    network_type,
                    name,
                    info,
                    type,
                },
            );
            alert("요금제 그룹이 추가되었습니다.");
            invalidateAll();
        } catch (error) {
            alert("통신사와 통신 방식은 중복될수 없습니다.");
        }
    }

    // update
    async function update_modal_open() {
        console.log(actButton);
        actButton = "update";
        console.log(this.value);

        id = plans_groups[this.value].id;
        carrier = plans_groups[this.value].carrier;
        network_type = plans_groups[this.value].network_type;
        name = plans_groups[this.value].name;
        info = plans_groups[this.value].info;

        add_group_modal.showModal();
    }

    async function update_plan_groups() {
        let type = "update";
        try {
            const res = await axios.post(
                `${back_api}/admin/plans_groups_upload_update`,
                {
                    id,
                    carrier,
                    network_type,
                    name,
                    info,
                    type,
                },
            );
            alert("요금제 그룹이 수정이 완료 되었습니다.");
            invalidateAll();
        } catch (error) {
            alert("통신사와 통신 방식은 중복될수 없습니다.");
        }
    }

    async function sortFunc() {
        console.log(this.value);
        console.log(this.dataset.idx);

        let originData = {};
        let changeData = {};

        if (this.value === "up") {
            originData = plans_groups[this.dataset.idx];
            changeData = plans_groups[Number(this.dataset.idx) + 1];
        } else {
            originData = plans_groups[this.dataset.idx];
            changeData = plans_groups[Number(this.dataset.idx) - 1];
        }

        if (!originData || !changeData) {
            alert("더이상 이동할수 없습니다.");
            return;
        }

        console.log("???");

        try {
            const res = await axios.post(`${back_api}/admin/plan_groups_sort`, {
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

    async function deletePlanGroup() {
        console.log(this.value);
        let confirm_check = confirm("정말 요금제 그룹을 삭제하시겠습니까?");
        if (!confirm_check) {
            return;
        }
        try {
            const res = await axios.post(
                `${back_api}/admin/plan_groups_delete`,
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

<dialog class="modal" id="add_group_modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">요금제 그룹 추가</h3>

        <div class="mt-5">
            <table class="w-full">
                <tbody>
                    <tr>
                        <th class="tb_th">통신사</th>
                        <td class="tb_td">
                            <select
                                bind:value={carrier}
                                class="w-full input-box"
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
                        <th class="tb_th">그룹명</th>
                        <td class="tb_td">
                            <input
                                type="text"
                                class="w-full input-box"
                                bind:value={name}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th class="tb_th">문구</th>
                        <td class="tb_td">
                            <input
                                type="text"
                                class="w-full input-box"
                                bind:value={info}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="text-right">
                <span class="text-xs">
                    그룹몀과 문구는 섹션 상단 표시 됩니다. (안쓰실거면 안써도
                    됨)
                </span>
            </div>
        </div>

        <div class="modal-action">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <!-- svelte-ignore event_directive_deprecated -->
                {#if actButton === "create"}
                    <button
                        class="btn btn-outline btn-primary"
                        on:click={upload_plan_groups}
                    >
                        추가
                    </button>
                {:else}
                    <button
                        class="btn btn-outline btn-primary"
                        on:click={update_plan_groups}
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
            actButton = "create";
            carrier = "SKT";
            network_type = "5G";
            name = "";
            info = "";

            add_group_modal.showModal();
        }}
    >
        요금제 그룹 추가
    </button>
</div>

<!-- svelte-ignore a11y_consider_explicit_label -->
<!-- svelte-ignore event_directive_deprecated -->
<div>
    <table class="w-full">
        <thead>
            <tr>
                <th class="tb_th w-[10%]">통신사</th>
                <th class="tb_th">통신방식</th>
                <th class="tb_th">그룹명</th>
                <th class="tb_th min-w-[150px]">문구</th>
                <th class="tb_th min-w-[150px]">버튼</th>
            </tr>
        </thead>
        <tbody>
            {#each plans_groups as planData, idx}
                <tr>
                    <td class="tb_td">
                        {planData.carrier}
                    </td>
                    <td class="tb_td">
                        {planData.network_type}
                    </td>
                    <td class="tb_td">
                        {planData.name}
                    </td>
                    <td class="tb_td">
                        {planData.info}
                    </td>
                    <td class="tb_td" style="width: 200px;">
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
                                value={planData.id}
                                on:click={deletePlanGroup}
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
