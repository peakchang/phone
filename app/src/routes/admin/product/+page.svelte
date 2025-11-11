<script>
    const carriers = ["SKT", "KT", "LGU"];
    const networkType = ["5G", "LTE"];

    let name = $state("");
    let description = $state("");

    let info = $state("");
</script>

<dialog class="modal" id="add_product_modal">
    <div class="modal-box">
        <h3 class="text-lg font-bold">상품 그룹 (메뉴) 추가</h3>

        <div class="mt-5">
            <table class="w-full">
                <tbody>
                    <tr>
                        <th class="tb_th">그룹명(메뉴명)</th>
                        <td class="tb_td">
                            <select class="w-full input-box"></select>
                        </td>
                    </tr>
                    <tr>
                        <th class="tb_th">상품명</th>
                        <td class="tb_td">
                            <input
                                type="text"
                                class="w-full input-box"
                                bind:value={description}
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

<dialog class="modal" id="modify_product_modal">
    <div class="modal-box w-11/12 max-w-5xl">
        <h3 class="text-lg font-bold">상품 정보 수정</h3>

        <div class="mt-5">
            <table class="w-full">
                <tbody>
                    <tr>
                        <th class="tb_th">그룹명(메뉴명)</th>
                        <td class="tb_td">
                            <select class="w-full input-box"></select>
                        </td>
                    </tr>
                    <tr>
                        <th class="tb_th">상품명</th>
                        <td class="tb_td">
                            <input
                                type="text"
                                class="w-full input-box"
                                bind:value={description}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th class="tb_th">사용할 통신사</th>
                        <td class="tb_td">
                            <input
                                type="text"
                                class="w-full input-box"
                                bind:value={description}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th class="tb_th">색상</th>
                        <td class="tb_td">
                            <input
                                type="text"
                                class="w-full input-box"
                                bind:value={description}
                            />
                        </td>
                    </tr>

                    <tr>
                        <th class="tb_th">상품정보</th>
                        <td class="tb_td">
                            <textarea class="w-full input-box"></textarea>
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
            add_product_modal.showModal();
        }}
    >
        상품 추가
    </button>

    <!-- svelte-ignore event_directive_deprecated -->
    <button class="btn btn-primary btn-sm"> 상품 복사 </button>
</div>

<div>
    <table class="w-full">
        <thead>
            <tr
                ><th class="tb_th">
                    <input
                        type="checkbox"
                        class="checkbox checkbox-sm bg-white checked:bg-white"
                    />
                </th>
                <th class="tb_th">그룹(메뉴)</th>
                <th class="tb_th">상품정보</th>
                <th class="tb_th">SKT 정보</th>
                <th class="tb_th">KT 정보</th>
                <th class="tb_th">LGU 정보</th>
            </tr>
        </thead>
        <tbody>
            <!-- svelte-ignore event_directive_deprecated -->
            <tr>
                <td class="border border-gray-300 text-center w-[50px]">
                    <div class="flex items-center justify-center">
                        <input type="checkbox" class="checkbox checkbox-sm" />
                    </div>
                </td>
                <td class="tb_td">갤럭시S25 시리즈</td>
                <td class="tb_td">
                    <div class="flex justify-center items-center gap-2">
                        <span> 갤럭시S25 </span>
                        
                        <button
                            class="btn btn-accent btn-xs text-white"
                            on:click={() => {
                                modify_product_modal.showModal();
                            }}
                        >
                            상품정보 수정
                        </button>
                    </div>
                </td>
                <td class="tb_td">
                    <button class="btn btn-info btn-xs text-white">
                        요금제
                    </button>
                    <button class="btn btn-info btn-xs text-white">
                        공시/할인
                    </button>
                </td>
                <td class="tb_td">
                    <button class="btn btn-info btn-xs text-white">
                        요금제
                    </button>
                    <button class="btn btn-info btn-xs text-white">
                        공시/할인
                    </button>
                </td>
                <td class="tb_td">
                    <button class="btn btn-info btn-xs text-white">
                        요금제
                    </button>
                    <button class="btn btn-info btn-xs text-white">
                        공시/할인
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
