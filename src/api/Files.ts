import { OSSUrlType, useOssStore } from "@/store";
import axios from "@/utils/axios";

const prefixUrl = '/Files';
const url = function (suffix: string) {
    return `/files/${suffix}`;
}

export const upload = async function ({ path, file, ext, encrypt, sync = false }: { path: OSSUrlType, file: File | Blob, ext?: string, encrypt?: boolean, sync?: boolean }, cb?: (progress: number) => void) {
    // const res = await new Promise<{ filename: string }>(resolve => {
    //     let progress = 0;
    //     const timer = setInterval(() => {
    //         progress += 0.1;
    //         if (cb) cb(progress);
    //         if (progress >= 1) {
    //             clearInterval(timer);
    //             resolve({ filename: Math.random().toString() });
    //         }
    //     }, 100);
    // })
    const store = useOssStore();
    const form = new FormData();
    form.append('file', file);
    if (ext) form.append('ext', ext);
    if (encrypt) form.append('encrypt', 'true');
    const res: { filename: string; iv?: string; } = await axios.put(`/upload/${store.ossUrlPath[path]}`, form, {
        headers: {
            "Content-Type": 'multipart/form-data'
        },
        onUploadProgress(progressEvent) {
            if (progressEvent.progress && cb) cb(progressEvent.progress);
        },
        prefixUrl
        // sync
    });
    return res;
}