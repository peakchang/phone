<script>
    let group_id = $state("");
    let name = $state("");
    let price = $state(0);
    let voice = $state("");
    let data = $state("");
    let sms = $state("");
    let benefits = $state("");
</script>

<dialog class="modal" id="add_plan_modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">요금제 추가</h3>

        <div class="mt-5">
            <table class="w-full">
                <tbody>
                    <tr>
                        <th class="tb_th">그룹</th>
                        <td class="tb_td">
                            <select
                                bind:value={group_id}
                                class="w-full input-box"
                            >
                                <option value="">선택하세요</option>
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
                                bind:value={data}
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
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn">Close</button>
            </form>
        </div>
    </div>
</dialog>

<div class="mb-5">
    <!-- svelte-ignore event_directive_deprecated -->
    <button
        class="btn btn-primary btn-sm"
        on:click={() => {
            add_plan_modal.showModal();
        }}
    >
        요금제 추가
    </button>
</div>

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
            <tr>
                <td class="border border-gray-300 text-center w-[50px]">
                    <div class="flex items-center justify-center">
                        <input type="checkbox" class="checkbox checkbox-sm" />
                    </div>
                </td>

                <td class="tb_td">SKT</td>
                <td class="tb_td">5G</td>
                <td class="tb_td">5GX 플랜</td>
                <td class="tb_td"> 프리미어 에센셜 </td>
                <td class="tb_td">115000</td>
                <td class="tb_td">
                    <div class="w-[190px]">유무선 무제한 (부가 음성 300분)</div>
                </td>
                <td class="tb_td">완전 무제한</td>
                <td class="tb_td">완전 무제한</td>
                <td class="tb_td">
                    <div class="max-w-[500px] truncate mx-auto">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Cupiditate in dolor animi. Ut accusamus odio
                        voluptatibus recusandae! Voluptatem harum natus
                        exercitationem dolorem officiis, itaque neque nostrum!
                        Sed impedit natus voluptas!
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>
