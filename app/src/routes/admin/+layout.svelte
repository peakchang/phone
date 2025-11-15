<script>
    import { goto } from "$app/navigation";
    import favicon from "$lib/assets/favicon.svg";
    let { children } = $props();

    let gnbUl = $derived({});

    function movePage() {
        const liList = gnbUl.children;
        console.log(liList);
        console.log(this);
        
        
        for (let i = 0; i < liList.length; i++) {
            const el = liList[i];
            el.classList.remove("gnb-on");
        }
        this.classList.add("gnb-on");
        goto(`/admin/${this.dataset.link}`);
    }
</script>

<div class="suit-font">
    <div id="hd_top" class="flex items-center">
        <div
            class="w-[50px] h-[50px] bg-[#223390] flex items-center justify-center mr-3"
        >
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button type="button" id="btn-gnb" class="cursor-pointer">
                <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.3103 1.77586C11.6966 1.40805 12.3034 1.40805 12.6897 1.77586L20.6897 9.39491L23.1897 11.7759C23.5896 12.1567 23.605 12.7897 23.2241 13.1897C22.8433 13.5896 22.2103 13.605 21.8103 13.2241L21 12.4524V20C21 21.1046 20.1046 22 19 22H14H10H5C3.89543 22 3 21.1046 3 20V12.4524L2.18966 13.2241C1.78972 13.605 1.15675 13.5896 0.775862 13.1897C0.394976 12.7897 0.410414 12.1567 0.810345 11.7759L3.31034 9.39491L11.3103 1.77586ZM5 10.5476V20H9V15C9 13.3431 10.3431 12 12 12C13.6569 12 15 13.3431 15 15V20H19V10.5476L12 3.88095L5 10.5476ZM13 20V15C13 14.4477 12.5523 14 12 14C11.4477 14 11 14.4477 11 15V20H13Z"
                        fill="#FFFFFF"
                    />
                </svg>
            </button>
        </div>

        <div>
            <div class="text-white">관리자 페이지</div>
        </div>
    </div>
    <div id="gnb">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore event_directive_deprecated -->
        <ul class="gnb-ul" bind:this={gnbUl}>
            <li
                class="px-5 py-3 cursor-pointer text-sm gnb-on"
                data-link=""
                on:click={movePage}
            >
                <span class="mr-1">
                    <i class="fa fa-users" aria-hidden="true"></i>
                </span>
                <span>회원 관리</span>
            </li>

            <li
                class="px-5 py-3 cursor-pointer text-sm"
                data-link="plans_group"
                on:click={movePage}
            >
                <span class="mr-1">
                    <i class="fa fa-folder-o" aria-hidden="true"></i>
                </span>
                <span>요금제 그룹 관리</span>
            </li>

            <li
                class="px-5 py-3 cursor-pointer text-sm"
                data-link="plans"
                on:click={movePage}
            >
                <span class="mr-1">
                    <i class="fa fa-area-chart" aria-hidden="true"></i>
                </span>
                <span>요금제 관리</span>
            </li>

            <li
                class="px-5 py-3 cursor-pointer text-sm"
                data-link="product_group"
                on:click={movePage}
            >
                <span class="mr-1">
                    <i class="fa fa-sticky-note-o" aria-hidden="true"></i>
                </span>
                <span>상품 그룹(메뉴) 관리</span>
            </li>

            <li
                class="px-5 py-3 cursor-pointer text-sm"
                data-link="product"
                on:click={movePage}
            >
                <span class="mr-1">
                    <i class="fa fa-cog" aria-hidden="true"></i>
                </span>
                <span>상품 관리</span>
            </li>

            <li
                class="px-5 py-3 cursor-pointer text-sm"
                data-link="qna"
                on:click={movePage}
            >
                <span class="mr-1">
                    <i class="fa fa-question-circle-o" aria-hidden="true"></i>
                </span>
                <span>문의 관리</span>
            </li>

            <li
                class="px-5 py-3 cursor-pointer text-sm"
                data-link="review"
                on:click={movePage}
            >
                <span class="mr-1">
                    <i class="fa fa-cog" aria-hidden="true"></i>
                </span>
                <span>후기 관리</span>
            </li>
        </ul>
    </div>
</div>

<div id="adm-container" class="suit-font">
    {@render children()}
</div>

<style>
    #adm-container {
        padding: 70px 30px 0 200px;
    }
    #hd_top {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 50px;
        background: #3f51b5;
        z-index: 1000;
    }
    #gnb {
        position: fixed;
        top: 0;
        left: 0;
        max-width: 220px;
        height: 100%;
        padding-top: 50px;
        z-index: 999;
    }

    .gnb-ul {
        position: relative;
        height: 100%;
        background: #ebebeb;
        width: 180px;
        padding-top: 30px;
    }

    .gnb-on {
        background-color: #ffffff; /* bg-white */
        border-right-width: 1px; /* border-r-1 */
        border-right-style: solid;
        border-right-color: #e5e7eb; /* border-gray-200 */
    }

    :global(.tb_th) {
        background: #6f809a;
        color: #ffffff;
        border: 1px solid #60718b;
        text-align: center;
        padding: 7px;
        font-size: 13px;
        font-weight: 300;
    }

    :global(.tb_td) {
        border: 1px solid #d6dce7;
        padding: 7px;
        font-size: 13px;
        min-width: 100px;
        text-align: center;
    }

    :global(.input-box) {
        border: 1px solid #d1d5db; /* border-gray-300 */
        padding: 0.375rem 0.75rem; /* px-3 py-1.5 */
        border-radius: 0.375rem; /* rounded-md */
        outline: none; /* focus:outline-none 기본 */
    }

    :global(.input-box:focus) {
        border-color: #3b82f6; /* focus:border-blue-500 */
        outline: none;
    }
</style>
