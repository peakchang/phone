<script>
    import imageCompression from "browser-image-compression";
    import axios from "axios";
    import { back_api } from "$lib/const";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    export let domainFolder = "temp";

    // 이미지를 선택하면 사이즈 변경 (최대 1200px) 및 webp 변경 후 업로드
    const uploadImageoAct = (e) => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", ".png,.jpg,.jpeg,.webp");
        input.click();

        // input change
        input.onchange = async (e) => {
            const imageFile = e.target.files[0];
            const options = {
                maxSizeMB: 1, // 최대 파일 크기 (MB)
                // maxWidthOrHeight: 1024, // 최대 너비 또는 높이
                useWebWorker: true, // 웹 워커 사용
            };

            try {
                const compressedFile = await imageCompression(
                    imageFile,
                    options,
                );
                const { width, height } = await getDimensions(compressedFile);
                let imgForm = new FormData();
                const timestamp = new Date().getTime();
                const fileName = `${timestamp}${Math.random()
                    .toString(36)
                    .substring(2, 11)}.${compressedFile.name.split(".")[1]}`;

                console.log(fileName);
                imgForm.append("folder", domainFolder);
                imgForm.append("onimg", compressedFile, fileName);

                // FormData의 key 값과 value값 찾기
                // let keys = imgForm.keys();
                // for (const pair of keys) {
                //     console.log(`name : ${pair}`);
                // }

                // let values = imgForm.values();
                // for (const pair of values) {
                //     console.log(`value : ${pair}`);
                // }

                const res = await axios.post(
                    `${back_api}/img_upload_set`,
                    imgForm,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    },
                );

                console.log(res);

                if (res.status == 200) {
                    const imgPath = res.data.saveUrl;
                    dispatch("sendImgPath", {
                        imgPath,
                        width,
                        height,
                    });
                }
            } catch (error) {
                console.error("Error during image compression:", error);
                alert("이미지 업로드 오류! 다시 시도해주세요!");
            }
        };
    };

    const getDimensions = (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    width: img.width,
                    height: img.height,
                });
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    };
</script>

<button class="btn btn-accent btn-sm text-white" on:click={uploadImageoAct}>
    이미지 업로드
</button>
