<script>
    import Sortable from "sortablejs";
    import imageCompression from "browser-image-compression";
    import axios from "axios";
    import { back_api } from "$lib/const";
    import { page } from "$app/stores";
    import { uploadMultipleImagesAct } from "$lib/lib.js";

    let {
        updateImg,
        imgModifyList = [],
        maxImgCount = 999999,
        detailShow = true,
        imgFolder = "test",
        btnLocation = "center",
    } = $props();

    let imgArr = $state([]);

    let imageOrigin = import.meta.env.VITE_SERVER_URL
        ? import.meta.env.VITE_SERVER_URL
        : $page.url.origin;

    let sortable = $state(null);

    if (imgModifyList && imgModifyList.length > 0) {
        const tempImgArr = [];
        for (let i = 0; i < imgModifyList.length; i++) {
            const con = imgModifyList[i];
            const imgObj = { id: i + 1, href: con };
            tempImgArr.push(imgObj);
        }
        imgArr = tempImgArr;
    }

    // function addVal(getHerf) {
    //     const newId =
    //         imgArr.length > 0
    //             ? Math.max(...imgArr.map((fruit) => fruit.id)) + 1
    //             : 1;
    //     const newObj = {
    //         id: newId, // 가장 큰 id 값 + 1
    //         href: getHerf, // 새로운 text 값
    //     };
    //     imgArr = [...imgArr, newObj];
    // }

    function addVals(getHerfs) {
        for (let i = 0; i < getHerfs.length; i++) {
            const newId =
                imgArr.length > 0
                    ? Math.max(...imgArr.map((fruit) => fruit.id)) + 1
                    : 1;
            const newObj = {
                id: newId, // 가장 큰 id 값 + 1
                href: getHerfs[i], // 새로운 text 값
            };

            imgArr.push(newObj);
        }
    }

    async function deleteImg() {
        const delTarget = imgArr[this.value];
        const delTargetArr = delTarget.href.split("/");
        const delFolder = delTargetArr[delTargetArr.length - 2];
        const delFile = delTargetArr[delTargetArr.length - 1];
        try {
            const res = await axios.post(`${back_api}/delete_sort_img`, {
                delFolder,
                delFile,
            });
        } catch (error) {}
        imgArr.splice(this.value, 1);
        updateImg(imgArr);
    }

    function onFileSelected() {


        uploadMultipleImagesAct(
            `${back_api}/img_upload_multiple`,
            (err, data) => {

                const saveUrlTempArr = [];

                data.files.forEach((e) => {
                    saveUrlTempArr.push(e.saveUrl);
                });

                addVals(saveUrlTempArr);
                updateImg(imgArr);
            },
            {
                folder: imgFolder,
            },
        );
    }

    // 아래는 sortable 관련 함수! 건드리지 말기!!

    useSortable(() => sortable, {
        animation: 200,
        handle: ".my-handle",
        ghostClass: "opacity-0",
        onEnd(evt) {
            imgArr = reorder(imgArr, evt);
            updateImg(imgArr);
        },
    });

    function useSortable(getter, options) {
        $effect(() => {
            const sortableEl = getter();
            const sortable = sortableEl
                ? Sortable.create(sortableEl, options)
                : null;
            return () => sortable?.destroy();
        });
    }

    function reorder(array, evt) {
        // should have no effect on stores or regular array
        const workArray = $state.snapshot(array);

        // get changes
        const { oldIndex, newIndex } = evt;

        if (oldIndex === undefined || newIndex === undefined) {
            return workArray;
        }
        if (newIndex === oldIndex) {
            return workArray;
        }

        // move elements
        const target = workArray[oldIndex];
        const increment = newIndex < oldIndex ? -1 : 1;

        for (let k = oldIndex; k !== newIndex; k += increment) {
            workArray[k] = workArray[k + increment];
        }
        workArray[newIndex] = target;
        return workArray;
    }
</script>

<div class="hidden opacity-0"></div>

<ul class="flex flex-wrap m-2 gap-2" bind:this={sortable}>
    {#each imgArr as img, idx (img)}
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <!-- svelte-ignore event_directive_deprecated -->
        <li
            class="flex w-24 h-24 items-center justify-center border border-gray-400 my-handle rounded-lg overflow-hidden relative"
            data-idx={idx}
        >
            <button
                class="absolute top-0 right-1 text-red-400 cursor-pointer"
                type="button"
                value={idx}
                on:click={deleteImg}
            >
                <i class="fa fa-times-circle-o" aria-hidden="true"></i>
            </button>

            <img src={imageOrigin + img.href} alt="" />
        </li>
    {/each}
</ul>

<!-- svelte-ignore event_directive_deprecated -->
<div class:text-center={btnLocation == "center"}>
    <button
        class="btn btn-info btn-sm text-white pretendard"
        type="button"
        on:click={onFileSelected}
    >
        이미지 추가하기
    </button>
</div>
