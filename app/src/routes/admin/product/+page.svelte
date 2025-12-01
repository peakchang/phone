<script>
    import { onMount } from "svelte";
    import SortImg from "$lib/components/SortImg.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import axios from "axios";
    import { back_api } from "$lib/const.js";
    import { checkEmptyObj } from "$lib/lib.js";
    import { tick } from "svelte";
    import { invalidateAll } from "$app/navigation";

    let { data } = $props();

    // 기본 불러오기 데이터

    let products = $state([]);
    let planDatas = $state([]); // 요금제 정보, {그룹정보[요금제]} 순으로 되어 있다.
    let filterPlanDatas = $state([]);

    // 모달 및 상태
    let productModalBool = $state(false); // 상품 관리 모달
    let planSetModalBool = $state(false); // 요금제 셋팅 관리 모달
    let productDetailModalBool = $state(false); // 디테일 (공시 / 할인 등) 관리 모달
    let actButton = $state("upload"); // 상품 업데이트시 추가 or 수정 체크
    let loadProductGroups = $state([]); // 상품 그룹 저장 변수
    let productData = $state({});
    let nowCarrier = $state("");
    let nowProductId = $state("");
    let planMaxLength = $state(0); // 디테일 관리시, plans 각 배열 중 가장 긴 배열 저장하는 변수 (grid 설정 때문)

    // 요금제 정보 객체 임시 변수
    let plansDetailObj = $state({}); // 각 지원금 (아래 detailConfig) 저장할 임시변수,
    let gongsiData = $state([]); // 공시지원금 DB 저장 전 담을 임시 변수

    // 이미지 및 기타, 객체에 직접 저장 안되니 DB 저장 전 담아놓을 배열 (추후 텍스트로 변경 후 DB 저장할 데이터)
    let tempPlanData = $state([]);

    let productGroups = $state([]);
    let imgUrlArr = $state([]);
    let productInfoImgArr = $state([]);

    // 불러온 요금제들에 대해서 할인 정보들을 넣기 위한 변수
    const detailConfig = [
        { name: "신규 공시 추가지원", key: "new_gongsi_gongtong" },
        { name: "신규 공시 프리할부", key: "new_gongsi_free" },
        { name: "신규 선약 추가지원", key: "new_sunyak_gongtong" },
        { name: "신규 선약 프리할부", key: "new_sunyak_free" },
        { name: "MNP 공시 추가지원", key: "mnp_gongsi_gongtong" },
        { name: "MNP 공시 프리할부", key: "mnp_gongsi_free" },
        { name: "MNP 선약 추가지원", key: "mnp_sunyak_gongtong" },
        { name: "MNP 선약 프리할부", key: "mnp_sunyak_free" },
        { name: "기변 공시 추가지원", key: "gibyun_gongsi_gongtong" },
        { name: "기변 공시 프리할부", key: "gibyun_gongsi_free" },
        { name: "기변 선약 추가지원", key: "gibyun_sunyak_gongtong" },
        { name: "기변 선약 프리할부", key: "gibyun_sunyak_free" },
    ];

    onMount(() => {
        loadProductGroups = data.product_groups;
        products = data.products;
        console.log(products);
    });

    // imgUrlArr / productInfoImgArr 에 각각 상품 이미지 / 상품 설명 이미지 배열에 담아주기! (업로드시 문자열로 변환)
    function updateProductImg(e) {
        const tempArr = [];
        e.forEach((val) => {
            tempArr.push(val.href);
        });
        imgUrlArr = tempArr;
    }

    function updateProductInfoImg(e) {
        const tempArr = [];
        e.forEach((val) => {
            tempArr.push(val.href);
        });
        productInfoImgArr = tempArr;
    }

    // 기본 상품 업로드, 요금제 / 공시 / 할인 등 제외 하고 상품명 / 이미지 / 색상 등 업로드 하는 함수
    async function upsert_product() {
        if (productGroups.length == 0) {
            alert("그룹 선택은 필수 입니다.");
            return;
        }
        productData["product_groups"] = productGroups.join(",");

        if (imgUrlArr.length > 0) {
            productData["img_urls"] = imgUrlArr.join(",");
        }

        if (productInfoImgArr.length > 0) {
            productData["product_info_imgs"] = productInfoImgArr.join(",");
        }

        productData["type"] = this.value;

        try {
            const res = await axios.post(
                `${back_api}/admin/upsert_product`,
                productData,
            );

            if (res.status) {
                productData = {};
                productModalBool = false;
                invalidateAll();
            }
        } catch (error) {}
    }

    // 공시 / 할인 버튼 클릭 후 모달 열때 생기는 액션
    async function setProductDetail() {
        nowCarrier = this.dataset.carrier;
        nowProductId = this.value;

        // 전체 요금제 불러오기
        const res = await axios.post(`${back_api}/admin/get_plans`, {
            carrier: nowCarrier,
        });

        planDatas = res.data.planArrangeList;

        // 클릭된 index 의 상품 값 가져오기 (객체 1개)
        const getProductInfo = products.find(
            (v) => v.id == Number(nowProductId),
        );

        // 사용할 요금제 걸러내기 (id 값으로 )
        const useYog = getProductInfo[`${nowCarrier}_plans`]
            .split(",")
            .map(Number);

        const useSet = new Set(useYog);

        // 전체 요금제에서 사용할 요금제 제외하고 다 없애기
        filterPlanDatas = planDatas
            .map((group) => {
                const filteredPlans = group.plans.filter((plan) =>
                    useSet.has(plan.id),
                );

                return {
                    ...group, // 그룹 정보 복사
                    plans: filteredPlans, // 필터링된 plans만 넣기
                };
            })
            .filter((group) => group.plans.length > 0); // plans가 비면 그룹 삭제

        // filterPlanDatas
        planMaxLength = Math.max(
            ...filterPlanDatas.map((item) => item.plans.length),
        );

        // 기존 저장된 공시 데이터가 있을 경우 적용
        if (getProductInfo[`${nowCarrier}_public_subsidy`]) {
            gongsiData =
                getProductInfo[`${nowCarrier}_public_subsidy`].split(",");
        }

        // 기존 저장된 할인 데이터가 있을 경우 적용
        if (getProductInfo[`${nowCarrier}_discount_json`]) {
            plansDetailObj = JSON.parse(
                getProductInfo[`${nowCarrier}_discount_json`],
            );
        }

        productDetailModalBool = true;
    }

    // 상품 별 요금제 모달을 열었을 경우 요금제 불러오기 밑 DB에 저장된 요금제 미리 선택
    async function setPlansBase() {
        tempPlanData = [];
        try {
            nowCarrier = this.dataset.carrier;
            nowProductId = this.value;

            console.log(nowProductId);
            console.log(nowCarrier);

            const res = await axios.post(`${back_api}/admin/get_plans`, {
                carrier: nowCarrier,
            });
            planDatas = res.data.planArrangeList;

            planSetModalBool = true;

            const getProductData = products.find(
                (item) => item.id === Number(nowProductId),
            );

            if (getProductData[`${nowCarrier}_plans`]) {
                tempPlanData = getProductData[`${nowCarrier}_plans`]
                    .split(",")
                    .map(Number);
            }
        } catch (error) {
            const m = error.response.data.message;
            alert(m);
        }
    }

    // 요금제 정보는 tempPlanData 에 binding 시켰고~ 이건 요금제가 다 선택 되었을 경우 전체 선택에 체크 하는 함수
    async function setPlans() {
        // 먼저 onChange 했을때 group 의 갯수와 배열 내의 길이가 맞지 않으면 전체선택 체크 또는 해제
        const groupId = Number(this.dataset.groupid);
        const getGroup = planDatas.find((item) => item.id === groupId);

        const allcheckedEle =
            this.parentElement.parentElement.parentElement.parentElement.children[0].children[1].querySelector(
                'input[type="checkbox"]',
            );
        if (getGroup.plans.length == tempPlanData.length) {
            allcheckedEle.checked = true;
        } else {
            allcheckedEle.checked = false;
        }
    }

    // 전체 선택 클릭시 해당 그룹 하위 요금제 전체 체크하는 함수
    function allChecked() {
        console.log(planDatas);

        const groupId = Number(this.value);
        const getGroup = planDatas.find((item) => item.id === groupId);

        if (this.checked) {
            tempPlanData = [
                ...new Set([
                    ...tempPlanData,
                    ...getGroup.plans.map((p) => p.id),
                ]),
            ];
        } else {
            const removeIds = getGroup.plans.map((p) => p.id); // 지울 ID 목록
            tempPlanData = tempPlanData.filter((id) => !removeIds.includes(id));
        }
    }

    // 선택된 요금제 해당 아이디 / 통신사에 업데이트 하는 함수
    async function updatePlans() {
        if (tempPlanData.length == 0) {
            alert("선택된 요금제가 없습니다. 요금제를 선택해 주세요");
            return;
        }

        console.log(tempPlanData);

        try {
            const res = await axios.post(`${back_api}/admin/update_plans`, {
                carrier: nowCarrier,
                planData: tempPlanData,
                productId: nowProductId,
            });
            alert("요금제 저장이 완료 되었습니다.");
            invalidateAll();
            planSetModalBool = false;
            location.reload();
        } catch (error) {
            const m = error.response.data.message;
            alert(m);
        }
    }

    // 모달 오픈시 전체선택이 되어 있어야 할 경우 체크 해주는 함수 (DB에는 요금제만 저장이 되어 있으므로 체크해서 전체선택 체크)
    function allchkSet(groupId) {
        const getGroup = planDatas.find((item) => item.id === groupId);
        const groupIds = getGroup.plans.map((p) => p.id);
        const isAllChecked = groupIds.every((id) => tempPlanData.includes(id));
        return isAllChecked;
    }

    function showPlan(data) {
        console.log(data);
    }

    async function detailUpdate() {
        const saveData = {};

        saveData["id"] = nowProductId;
        saveData["carrier"] = nowCarrier;
        saveData[`${nowCarrier}_public_subsidy`] = gongsiData.join(",");
        saveData[`${nowCarrier}_discount_json`] =
            JSON.stringify(plansDetailObj);
        console.log(saveData);

        try {
            const res = await axios.post(
                `${back_api}/admin/update_detail`,
                saveData,
            );
            alert("공시지원금 및 할인 정보 저장이 완료 되었습니다.");
            invalidateAll();
            productDetailModalBool = false;
            location.reload();
        } catch (error) {
            const m = error.response.data.message;
            alert(m);
        }
    }

    // 상품 수정시!! (상품 정보 불러와야 함)
    function productModify() {
        // 먼저 아이디 값으로 (각 행에 아이디 부여된거 this.value 로 가져옴)로 상품 정보 가져옴
        const idx = Number(this.value);
        productData = products.find((item) => item.id === idx);

        // 그룹 정보 가져와야 함, loadProductGroups 에 저장된 그룹들 정보로
        // 상품(DB)에 저장된 그룹 네임을 먼저 배열화 시킨 뒤,
        // 배열에 id 값을 넣어서 바인딩 된 productGroups 변수에 입력

        const productGroupNames = productData.product_group_names.split(",");
        productGroups = loadProductGroups
            .filter((val, i) => val.name === productGroupNames[i])
            .map((val) => val.id);

        // 상품 이미지가 있으면 imgUrlArr 에 넣기, 가 저장된 값이 있을수 있으므로 없으면 빈 배열 반환
        if (productData.img_urls) {
            imgUrlArr = productData.img_urls.split(",");
        } else {
            imgUrlArr = [];
        }

        // 상품 정보 이미지가 있으면 productInfoImgArr 에 넣기, 가 저장된 값이 있을수 있으므로 없으면 빈 배열 반환
        if (productData.product_info_imgs) {
            productInfoImgArr = productData.product_info_imgs.split(",");
        } else {
            productInfoImgArr = [];
        }

        // 액션 값은 업데이트로 변경
        actButton = "update";
        productModalBool = true;
    }
</script>

<Modal
    isOpen={productDetailModalBool}
    maxWidth={"90%"}
    closeModal={() => {
        productDetailModalBool = false;
    }}
>
    <div class="mt-6.5">
        {#each filterPlanDatas as planData}
            <div class="border border-gray-400 p-2 rounded-md mb-3">
                <div>
                    {planData.name}
                </div>

                <div
                    class="grid gap-4 text-sm mb-2"
                    style="grid-template-columns: repeat({planMaxLength +
                        1}, minmax(0, 1fr))"
                >
                    <div class=" py-2 px-3 text-center">요금제 :</div>
                    {#each Array(planMaxLength + 1) as _, i}
                        {#if planData.plans[i]}
                            <div class="bg-gray-200 py-2 px-3 text-center">
                                {planData.plans[i]["name"]}
                            </div>
                        {/if}
                        <!-- {showPlan(planData.plans[i])} -->
                    {/each}
                </div>

                <div
                    class="grid gap-4 text-sm"
                    style="grid-template-columns: repeat({planMaxLength +
                        1}, minmax(0, 1fr))"
                >
                    <div class=" py-2 px-3 text-center">공시지원금 :</div>
                    {#each Array(planMaxLength + 1) as _, i}
                        {#if planData.plans[i]}
                            <div class="py-0.5 text-center flex items-center">
                                <input
                                    type="text"
                                    bind:value={gongsiData[i]}
                                    class="border border-gray-300 w-full bg-white p-2 text-sm focus:outline-none focus:border-blue-500 rounded-md"
                                />
                            </div>
                        {/if}
                        <!-- {showPlan(planData.plans[i])} -->
                    {/each}
                </div>

                {#each detailConfig as { name, key }}
                    <div
                        class="grid gap-4 text-sm"
                        style="grid-template-columns: repeat({planMaxLength +
                            1}, minmax(0, 1fr))"
                    >
                        <div class="py-2 px-3 text-center">
                            {name} :
                        </div>
                        {#each Array(planMaxLength + 1) as _, i}
                            {#if planData.plans[i]}
                                <div
                                    class="py-0.5 text-center flex items-center"
                                >
                                    <input
                                        type="text"
                                        bind:value={
                                            plansDetailObj[`${key}_${i}`]
                                        }
                                        class="border border-gray-300 w-full bg-white p-2 text-sm focus:outline-none focus:border-blue-500 rounded-md"
                                    />
                                </div>
                            {/if}
                        {/each}
                    </div>
                {/each}
            </div>
        {/each}

        <div>
            <button class="btn btn-primary" onclick={detailUpdate}>
                저장
            </button>
        </div>
    </div>
</Modal>

<!-- svelte-ignore event_directive_deprecated -->
<Modal
    isOpen={planSetModalBool}
    maxWidth={"45%"}
    closeModal={() => {
        planSetModalBool = false;
    }}
>
    <div class="mt-6.5">
        {#each planDatas as planData}
            <div class="border border-gray-400 p-3 rounded-md mb-3">
                <div class="flex justify-between items-center mb-3">
                    <div>
                        <span>{planData.name}</span>
                        <span class="badge badge-soft badge-info text-xs">
                            {planData.network_type}
                        </span>
                    </div>

                    <label>
                        <div class="flex items-center gap-1">
                            <span class="text-sm">전체 선택</span>
                            <input
                                type="checkbox"
                                class="checkbox checkbox-md"
                                checked={allchkSet(planData.id)}
                                value={planData.id}
                                onchange={allChecked}
                            />
                        </div>
                    </label>
                </div>

                {#each planData.plans as plan}
                    <label class="w-full">
                        <div
                            class="border border-gray-300 p-2 rounded-md mb-1 flex justify-between items-center"
                        >
                            <div class=" w-5/6 flex text-xs">
                                <div class="w-1/3">
                                    {plan.name}
                                </div>
                                <div class="w-1/3">
                                    {plan.voice}
                                </div>
                                <div class="w-1/3">
                                    {plan.price}
                                    {planData.network_type}
                                </div>
                            </div>

                            <div
                                class="text-right text-xs flex items-center gap-1"
                            >
                                <span>선택</span>

                                <input
                                    type="checkbox"
                                    class="checkbox checkbox-md"
                                    value={plan.id}
                                    data-groupid={planData.id}
                                    onchange={setPlans}
                                    bind:group={tempPlanData}
                                />
                            </div>
                        </div>
                    </label>
                {/each}
            </div>
        {/each}
    </div>

    <div class="text-right">
        <button class="btn btn-outline btn-primary" onclick={updatePlans}>
            수정 완료
        </button>
        <button
            class="btn"
            onclick={() => {
                planSetModalBool = false;
            }}
        >
            닫기
        </button>
    </div>
</Modal>

<!-- 상품 추가 모달 -->
<!-- svelte-ignore event_directive_deprecated -->
<Modal
    bind:isOpen={productModalBool}
    maxWidth={"80%"}
    closeModal={() => {
        productModalBool = false;
    }}
>
    <h3 class="text-lg font-bold">상품 그룹 (메뉴) 추가</h3>

    <div class="mt-5">
        <table class="w-full">
            <tbody>
                <tr>
                    <th class="tb_th w-52">그룹 선택</th>
                    <td class="tb_td">
                        <div class="flex justify-center items-center gap-3">
                            {#each loadProductGroups as productGroup}
                                <label class="flex items-center gap-1">
                                    <span>{productGroup.name}</span>
                                    <input
                                        type="checkbox"
                                        class="checkbox checkbox-sm"
                                        value={productGroup.id}
                                        bind:group={productGroups}
                                    />
                                </label>
                            {/each}
                        </div>
                    </td>
                </tr>
                <tr>
                    <th class="tb_th">상품명 (제목)</th>
                    <td class="tb_td">
                        <input
                            type="text"
                            class="w-full input-box"
                            bind:value={productData["name"]}
                        />
                    </td>
                </tr>
                <tr>
                    <th class="tb_th">부제목 (선택)</th>
                    <td class="tb_td">
                        <input
                            type="text"
                            class="w-full input-box"
                            bind:value={productData["sub_name"]}
                        />
                    </td>
                </tr>
                <tr>
                    <th class="tb_th">상품 이미지</th>
                    <td class="tb_td">
                        <SortImg
                            imgModifyList={imgUrlArr}
                            imgFolder="phone_img"
                            updateImg={updateProductImg}
                        ></SortImg>
                    </td>
                </tr>
                <tr>
                    <th class="tb_th">색상</th>
                    <td class="tb_td">
                        <input
                            type="text"
                            class="w-full input-box"
                            bind:value={productData["colors"]}
                        />
                    </td>
                </tr>
                <tr>
                    <th class="tb_th">색상 코드</th>
                    <td class="tb_td">
                        <input
                            type="text"
                            class="w-full input-box"
                            bind:value={productData["color_codes"]}
                        />
                    </td>
                </tr>
                <tr>
                    <th class="tb_th">상품 설명 상단 (TEXT)</th>
                    <td class="tb_td">
                        <textarea
                            class="w-full input-box"
                            rows="4"
                            bind:value={productData["product_info_top"]}
                        ></textarea>
                    </td>
                </tr>
                <tr>
                    <th class="tb_th">상품 설명 이미지</th>
                    <td class="tb_td">
                        <SortImg
                            imgModifyList={productInfoImgArr}
                            imgFolder="product_info"
                            updateImg={updateProductInfoImg}
                        ></SortImg>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="text-right mt-3">
            {#if actButton === "upload"}
                <button
                    class="btn btn-outline btn-primary"
                    value="upload"
                    onclick={upsert_product}
                >
                    추가
                </button>
            {:else}
                <button
                    class="btn btn-outline btn-primary"
                    value="update"
                    onclick={upsert_product}
                >
                    수정
                </button>
            {/if}
            <button
                class="btn"
                onclick={() => {
                    if (!checkEmptyObj(productData) && actButton == "upload") {
                        if (
                            !confirm(
                                "작성중인 내용이 있습니다. 종료 하겠습니까?",
                            )
                        ) {
                            return;
                        }
                    }

                    productModalBool = false;
                }}>닫기</button
            >
        </div>
    </div>
</Modal>

<div class="mb-5">
    <!-- svelte-ignore event_directive_deprecated -->
    <button
        class="btn btn-primary btn-sm"
        onclick={() => {
            productData = {};
            actButton = "upload";
            productModalBool = true;
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
            {#each products as product, idx}
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
                        {product["product_group_names"]}
                    </td>
                    <td class="tb_td">
                        <div class="flex justify-between items-center gap-2">
                            <span>
                                {product["name"]}
                            </span>

                            <button
                                class="btn btn-accent btn-xs text-white"
                                value={product.id}
                                onclick={productModify}
                            >
                                상품정보 수정
                            </button>
                        </div>
                    </td>
                    <td class="tb_td">
                        <button
                            class="btn btn-info btn-xs text-white"
                            value={product.id}
                            data-carrier="skt"
                            onclick={setPlansBase}
                        >
                            요금제
                        </button>
                        <button
                            class="btn btn-info btn-xs text-white"
                            value={product.id}
                            data-carrier="skt"
                            onclick={setProductDetail}
                        >
                            공시/할인
                        </button>
                    </td>
                    <td class="tb_td">
                        <button
                            class="btn btn-info btn-xs text-white"
                            value={product.id}
                            data-carrier="kt"
                            onclick={setPlansBase}
                        >
                            요금제
                        </button>
                        <button
                            class="btn btn-info btn-xs text-white"
                            value={product.id}
                            data-carrier="kt"
                            onclick={setProductDetail}
                        >
                            공시/할인
                        </button>
                    </td>
                    <td class="tb_td">
                        <button
                            class="btn btn-info btn-xs text-white"
                            value={product.id}
                            data-carrier="lgu"
                            onclick={setPlansBase}
                        >
                            요금제
                        </button>
                        <button
                            class="btn btn-info btn-xs text-white"
                            value={product.id}
                            data-carrier="lgu"
                            onclick={setProductDetail}
                        >
                            공시/할인
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
