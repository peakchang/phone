import axios from "axios";
import imageCompression from "browser-image-compression";

export function checkEmptyObj(obj) {
    return obj && Object.keys(obj).length === 0;
}


/**
 * 단일 이미지 업로드
 */
const uploadImageAct = (back_api_url, callback, options = {}) => {
    console.log('단일 이미지 업로드 함수 진입');
    console.log(options);

    const folder = options.folder || "testfolder2";
    const type = options.type || "normal"; // 'date' or 'normal'
    const maxSizeMB = options.maxSizeMB || 1;

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", ".png,.jpg,.jpeg,.webp");
    input.click();

    input.onchange = async (e) => {
        const imageFile = e.target.files[0];
        const compressionOptions = {
            maxSizeMB: maxSizeMB,
            useWebWorker: true,
        };

        try {
            const compressedFile = await imageCompression(imageFile, compressionOptions);

            let imgForm = new FormData();
            const timestamp = new Date().getTime();
            const fileName = `${timestamp}${Math.random()
                .toString(36)
                .substring(2, 11)}.${compressedFile.name.split(".")[1]}`;

            imgForm.append("folder", folder);
            imgForm.append("type", type);
            imgForm.append("onimg", compressedFile, fileName);

            const res = await axios.post(back_api_url, imgForm, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log(res);
            if (typeof callback === "function") {
                callback(null, res.data);
            }
        } catch (err) {
            console.error(err);
            if (typeof callback === "function") {
                callback(err, null);
            }
        }
    };
};

/**
 * 여러 이미지 업로드
 */
const uploadMultipleImagesAct = (back_api_url, callback, options = {}) => {
    console.log('여러 이미지 업로드 함수 진입');
    console.log(options);

    const folder = options.folder || "testfolder2";
    const type = options.type || "normal"; // 'date' or 'normal'
    const maxSizeMB = options.maxSizeMB || 1;
    const maxFiles = options.maxFiles || 10;

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", ".png,.jpg,.jpeg,.webp");
    input.setAttribute("multiple", "multiple");
    input.click();

    input.onchange = async (e) => {
        const imageFiles = Array.from(e.target.files);

        if (imageFiles.length > maxFiles) {
            if (typeof callback === "function") {
                callback(new Error(`최대 ${maxFiles}개의 파일만 업로드 가능합니다.`), null);
            }
            return;
        }

        const compressionOptions = {
            maxSizeMB: maxSizeMB,
            useWebWorker: true,
        };

        try {
            // 모든 이미지 압축 (순서 유지)
            const compressedFiles = [];
            for (let i = 0; i < imageFiles.length; i++) {
                const compressed = await imageCompression(imageFiles[i], compressionOptions);
                compressedFiles.push(compressed);
            }

            // FormData 생성
            let imgForm = new FormData();
            imgForm.append("folder", folder);
            imgForm.append("type", type);

            // 압축된 파일들을 순서대로 FormData에 추가
            compressedFiles.forEach((compressedFile, index) => {
                const timestamp = new Date().getTime();
                const randomStr = Math.random().toString(36).substring(2, 11);
                const extension = compressedFile.name.split(".").pop();
                const fileName = `${timestamp}_${index}_${randomStr}.${extension}`;

                imgForm.append("onimg", compressedFile, fileName);
            });

            // 업로드 요청
            const res = await axios.post(back_api_url, imgForm, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log(res);
            if (typeof callback === "function") {
                callback(null, res.data);
            }
        } catch (err) {
            console.error(err);
            if (typeof callback === "function") {
                callback(err, null);
            }
        }
    };
};

export { uploadImageAct, uploadMultipleImagesAct };
export default uploadImageAct;