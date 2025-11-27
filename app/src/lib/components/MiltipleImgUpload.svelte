<!-- OneImgUpload.svelte -->

<script>
    import imageCompression from "browser-image-compression";
    import axios from "axios";
    import { back_api } from "$lib/const";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    export let domainFolder = "temp";

    // 이미지 여러 개 업로드
    const uploadImageoAct = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", ".png,.jpg,.jpeg,.webp");
        input.setAttribute("multiple", "multiple"); // ✅ 여러 개 선택 허용

        input.onchange = async (e) => {
            const files = Array.from(e.target.files || []);
            if (!files.length) return;

            const options = {
                maxSizeMB: 1,
                useWebWorker: true,
            };

            // 업로드할 이미지 메타정보 (width, height) 저장용
            const metaList = [];
            const imgForm = new FormData();
            imgForm.append("folder", domainFolder);

            try {
                // 선택한 모든 파일 처리
                for (const imageFile of files) {
                    const compressedFile = await imageCompression(
                        imageFile,
                        options,
                    );

                    const { width, height } =
                        await getDimensions(compressedFile);

                    const ext = compressedFile.name.split(".").pop() || "webp";
                    const timestamp = new Date().getTime();
                    const fileName = `${timestamp}${Math.random()
                        .toString(36)
                        .substring(2, 11)}.${ext}`;

                    // 순서 유지용 메타정보 push
                    metaList.push({ width, height });

                    imgForm.append("onimg", compressedFile, fileName);
                }

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

                if (res.status === 200) {
                    // 백엔드에서 여러 개의 URL을 배열로 내려준다는 전제
                    const saveUrls = res.data.saveUrls || [];

                    saveUrls.forEach((imgPath, idx) => {
                        const { width, height } = metaList[idx] || {};
                        dispatch("sendImgPath", {
                            imgPath,
                            width,
                            height,
                        });
                    });
                }
            } catch (error) {
                console.error("Error during image compression:", error);
                alert("이미지 업로드 오류! 다시 시도해주세요!");
            }
        };

        input.click();
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
