<script>
    import axios from "axios";
    import { back_api } from "$lib/const";

    const carriers = ["SKT", "KT", "LGU"];
    const networkTypes = ["5G", "LTE"];

    let carrier = $state("SKT");
    let network_type = $state("5G");
    let name = $state("");
    let info = $state("");

    async function upload_plan_groups() {
        console.log(back_api);
        
        const res = await axios.post(`${back_api}/admin/plans_groups_upload`, {
            carrier,
            network_type,
            name,
            info,
        });

        console.log("gogogogo");
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
                <span class="text-xs"
                    >그룹몀과 문구는 섹션 상단 표시 됩니다. (안쓰실거면 안써도
                    됨)</span
                >
            </div>
        </div>

        <div class="modal-action">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button
                    class="btn btn-outline btn-primary"
                    on:click={upload_plan_groups}>추가</button
                >
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
            add_group_modal.showModal();
        }}
    >
        요금제 그룹 추가
    </button>
</div>

<div>
    <table class="w-full">
        <thead>
            <tr>
                <th class="tb_th w-[10%]">통신사</th>
                <th class="tb_th">통신방식</th>
                <th class="tb_th">그룹명</th>
                <th class="tb_th min-w-[350px]">문구</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="tb_td">SKT</td>
                <td class="tb_td">5G</td>
                <td class="tb_td">5GX 플랜</td>
                <td class="tb_td">
                    막강한 데이터&콘텐츠 혜택, LTE 라이프의 완성
                </td>
            </tr>
        </tbody>
    </table>
</div>
