<script>
    const carriers = ["SKT", "KT", "LGU"];
    const networkType = ["5G", "LTE"];

    let name = $state("");
    let description = $state("");

    let info = $state("");
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
                            <input type="text" class="w-full input-box" bind:value={name} />
                        </td>
                    </tr>
                    <tr>
                        <th class="tb_th">메뉴 설명</th>
                        <td class="tb_td">
                            <input type="text" class="w-full input-box" bind:value={description} />
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
                <th class="tb_th w-[35%]">메뉴명</th>
                <th class="tb_th w-[65%]">메뉴 설명</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="tb_td">갤럭시S25 시리즈</td>
                <td class="tb_td"></td>
            </tr>
        </tbody>
    </table>
</div>
