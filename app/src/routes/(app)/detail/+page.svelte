<script>
    let bottomInfoTab = $state("info");
</script>

<div class="max-w-[1100px] mx-auto mt-10">
    <!-- 사이트 계산기 부분 -->
    <div class=" grid grid-cols-1 md:grid-cols-3">
        <div class="text-center">
            <div class="text-2xl font-bold">U+ 카카오키즈폰 4</div>
            <div>
                <img src="/imgs/sample.jpg" alt="" class="mx-auto" />
            </div>
        </div>
        <div class="px-2">
            <div class="mb-5">
                <div class="mb-2">[용량]</div>
                <label>
                    <input type="radio" value="top" class="hidden peer" />

                    <div
                        class="mb-5 border peer-checked:border-pink-600 border-gray-200 p-2 mx-auto rounded-lg text-center"
                    >
                        64G
                    </div>
                </label>
            </div>

            <div class="mb-5">
                <div class="mb-2">[용량]</div>
                <label>
                    <input type="radio" value="top" class="hidden peer" />

                    <div
                        class="mb-5 border peer-checked:border-pink-600 border-gray-200 p-2 mx-auto rounded-lg text-center"
                    >
                        64G
                    </div>
                </label>
            </div>
        </div>
        <div class="text-center px-3">
            <div class="bg-[#f2f3f7] p-2 rounded-lg text-lg font-semibold">
                단말기 가격 안내
            </div>
            <div class="py-2 px-10">
                <div class="flex justify-between mb-3">
                    <span>출고가</span>
                    <span>322,000원</span>
                </div>

                <div class="flex justify-between mb-3 text-pink-600">
                    <span>특별할인</span>
                    <span>-0원</span>
                </div>

                <div class="flex justify-between mb-3 text-pink-600">
                    <span>공시지원금</span>
                    <span>-275,000원</span>
                </div>
            </div>
            <hr class="border-t border-gray-300" />

            <div class="py-2 px-10">
                <div class="flex justify-between mb-3">
                    <span>할부원금</span>
                    <span>47,000원</span>
                </div>
            </div>

            <div class="bg-[#f2f3f7] p-2 rounded-lg text-lg font-semibold">
                요금제 안내
            </div>

            <div class="py-2 px-10">
                <div class="flex justify-between mb-3">
                    <span>월 기본료</span>
                    <span>49,000원</span>
                </div>
            </div>

            <div class="border rounded-lg overflow-hidden">
                <div class="bg-[#6b6998] p-4 text-white">
                    <span class="text-xl font-semibold">월 청구요금</span>
                    <span class="text-xs">(월 할부금 + 월 기본료)</span>
                </div>

                <div class="p-4">
                    <p class="text-3xl font-semibold mb-3">월 50,958원</p>
                    <p>(1,958원 + 49,000원)</p>
                </div>
            </div>
        </div>
    </div>

    <div class="flex mt-10">
        <label class="button-checkbox">
            <input type="radio" value="info" bind:group={bottomInfoTab} />
            <div>상품정보</div>
        </label>

        <label class="button-checkbox">
            <input type="radio" value="review" bind:group={bottomInfoTab} />
            <div>구입후기</div>
        </label>

        <label class="button-checkbox">
            <input type="radio" value="inquiry" bind:group={bottomInfoTab} />
            <div>구입문의</div>
        </label>

        <label class="button-checkbox">
            <input type="radio" value="caution" bind:group={bottomInfoTab} />
            <div>주의사항</div>
        </label>
    </div>

    <div class="border p-2">
        {#if bottomInfoTab == "info"}
            <div>상품정보~~~~~~~~~~~~~</div>
        {:else if bottomInfoTab == "review"}
            <div>상품 리뷰~~~~~~</div>
            <div>
                <div class="border border-gray-400 rounded-md p-2 flex">
                    <div class="w-1/6 md:w-1/12 flex items-center">
                        <img src="/imgs/sample.jpg" alt="" class="mx-auto" />
                    </div>
                    <div
                        class="flex flex-col justify-center gap-1 relative w-full"
                    >
                        <div class="flex items-center gap-4 mb-1.5">
                            <span>갤럭시S22 플러스</span>
                            <button class="btn btn-info btn-xs text-white"
                                >상품확인</button
                            >
                        </div>
                        <div class="flex text-xs md:text-sm">
                            <div>
                                평점 :
                                <div class="rating rating-xs">
                                    <div
                                        class="mask mask-star-2 bg-yellow-500"
                                    ></div>
                                    <div
                                        class="mask mask-star-2 bg-yellow-500"
                                    ></div>
                                    <div
                                        class="mask mask-star-2 bg-yellow-500"
                                        aria-current="true"
                                    ></div>
                                    <div
                                        class="mask mask-star-2 bg-yellow-500"
                                    ></div>
                                    <div
                                        class="mask mask-star-2 bg-yellow-500"
                                    ></div>
                                </div>
                            </div>
                            <span class="mx-2">|</span>
                            <span>작성자 : 박창용</span>
                            <span class="mx-2">|</span>
                            <span>작성일 : 25.10.16</span>
                        </div>

                        <div class="md:absolute right-5 bottom-3 text-right">
                            <button class="btn btn-xs md:btn-sm">
                                펼쳐보기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        {:else if bottomInfoTab == "inquiry"}
            <div>문의~~~~~~~~~</div>

            <!-- 이게 한줄~ -->
            <div class="pt-3 ">
                <div class="flex justify-center w-full border-b pb-3 border-gray-300">
                    <div class="w-[15%]">
                        <div class="badge badge-soft badge-info badge-sm">
                            답변완료
                        </div>
                        <!-- <div class="badge badge-soft badge-secondary badge-sm">답변대기</div> -->
                    </div>
                    <div class="w-[50%] line-clamp-2 md:truncate">
                        Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Recusandae a dicta labore maxime laborum autem vel
                        libero. Omnis quia illum dolore iure hic, provident
                        repellendus voluptatum ut, praesentium animi fugiat?
                    </div>
                    <div class="w-[15%] text-center">박창용</div>
                    <div class="w-[15%] text-center">25.10.16</div>
                </div>
            </div>
        {:else}
            <div>주의사항~~~~</div>
        {/if}
    </div>
</div>

<style>
    .button-checkbox {
        display: inline-block;
        cursor: pointer;
        width: 25%;
        text-align: center;
        font-weight: 500;
    }

    .button-checkbox input {
        display: none; /* 숨기기 */
    }

    .button-checkbox div {
        padding: 10px 20px;
        background: #eee;
        transition: 0.3s;
    }

    /* 체크되었을 때 색 변경 */
    .button-checkbox input:checked + div {
        background: #6b6998;
        color: white;
    }

    .line-clamp-2 {
        width: 50%;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* 표시할 줄 수 */
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
