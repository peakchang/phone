<script>
    import Swiper from "swiper";
    import { Navigation, Pagination } from "swiper/modules";
    import { onMount } from "svelte";

    onMount(() => {
        const swiper = new Swiper(".mySwiper", {
            modules: [Navigation, Pagination],
            loop: true,
            navigation: {
                nextEl: ".swiper-next",
                prevEl: ".swiper-prev",
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
        });
    });
</script>



<div class="swiper mySwiper w-full md:max-w-[2000px]  mb-5">
    <div class="swiper-wrapper">
        <div class="swiper-slide">
            <img src="/mainbanner/banner1.jpg" alt="" />
        </div>
        <div class="swiper-slide">
            <img src="/mainbanner/banner2.jpg" alt="" />
        </div>
        <div class="swiper-slide">
            <img src="/mainbanner/banner3.jpg" alt="" />
        </div>
    </div>
    <div class="swiper-next absolute top-[42%] right-5 z-10">
        <div class="w-[40px] rounded-full bg-white cursor-pointer">
            <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="40px"
                height="40px"
                viewBox="0 0 64 64"
                enable-background="new 0 0 64 64"
                xml:space="preserve"
            >
                <g>
                    <polyline
                        fill="none"
                        stroke="#5D5D5D"
                        stroke-width="2"
                        stroke-linejoin="bevel"
                        stroke-miterlimit="10"
                        points="27,15 44,32 
		27,49 	"
                    />
                </g>
                <g>
                    <circle
                        fill="none"
                        stroke="#5D5D5D"
                        stroke-width="2"
                        stroke-miterlimit="10"
                        cx="32"
                        cy="32"
                        r="30.999"
                    />
                </g>
            </svg>
        </div>
    </div>
    <div class="swiper-prev absolute top-[42%] left-5 z-10">
        <div class="w-[40px] rounded-full bg-white cursor-pointer">
            <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="40px"
                height="40px"
                viewBox="0 0 64 64"
                enable-background="new 0 0 64 64"
                xml:space="preserve"
            >
                <g>
                    <polyline
                        fill="none"
                        stroke="#000000"
                        stroke-width="2"
                        stroke-linejoin="bevel"
                        stroke-miterlimit="10"
                        points="37,15 20,32 
		37,49 	"
                    />
                </g>
                <g>
                    <circle
                        fill="none"
                        stroke="#000000"
                        stroke-width="2"
                        stroke-miterlimit="10"
                        cx="32"
                        cy="32"
                        r="30.999"
                    />
                </g>
            </svg>
        </div>
    </div>
</div>

<div class="max-w-[1100px] mx-auto grid px-3 md:px-0 grid-cols-1 md:grid-cols-2">
    <div class="flex border border-gray-400 rounded-lg overflow-hidden">
        <div class="w-1/3">
            <img src="/imgs/sample.jpg" alt="" />
        </div>
        <div class="flex flex-col justify-around items-center w-2/3 py-3">
            <div class="text-xl font-bold">U+ 카카오키즈폰 4</div>
            <div class="text-2xl font-bold text-red-500">0원</div>
            <div class="text-xs bg-gray-200 py-1 px-2 rounded-md">
                LG / 신규가입 / 공시지원 할인 / LTE 키즈 29(만12세이하) 기준
            </div>
            <div>바로가기</div>
        </div>
    </div>
</div>

<style>
    .swiper {
        width: 100%;
        height: 400px;
    }

    .swiper-slide {
        text-align: center;
        font-size: 18px;
        background: #444;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .swiper-slide img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>
