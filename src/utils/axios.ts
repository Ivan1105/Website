// import router from '@/router';
// import { useStore } from '@/store';
import axios, { AxiosRequestConfig, Axios, Canceler } from 'axios'
// import { storage } from './storage';

declare module 'axios' {
    interface AxiosRequestConfig {
        /** 失败时是否不显示提示 */
        // hideMessage?: boolean;
        /** 取消相同key的未完成请求 */
        // key?: string;
        /** 是否不按标准数据返回格式处理 */
        // notStdResponse?: boolean;
        /** 是否同步 */
        // sync?: boolean;
        /** 自定义config */

        /** url前缀 */
        prefixUrl?: string;
        custom?: {
        }
    }
    interface AxiosHeaders {
        /** token */
        authorization?: string;
    }
}

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 60000,
    maxContentLength: 10240,
    maxRedirects: 5,
    headers: { 'Content-Type': 'application/json' }
})

/** 取消重复请求 */
// const CancelHandler = function () {
//     const handlers = new Map<string, Canceler>();
//     const cancel = function (config: AxiosRequestConfig) {
//         if (!config.key) return;
//         if (handlers.has(config.key)) {
//             handlers.get(config.key)!();
//             config.cancelToken = new axios.CancelToken(c => [
//                 handlers.set(config.key!, c)
//             ])
//         }
//         else {
//             config.cancelToken = new axios.CancelToken(c => {
//                 handlers.set(config.key!, c);
//             })
//         }
//     }
//     const remove = function (config: AxiosRequestConfig) {
//         if (!config.key) return;
//         handlers.delete(config.key);
//     }

//     return {
//         cancel,
//         remove
//     }
// }()

// 请求拦截
instance.interceptors.request.use(config => {
    if (config.prefixUrl) config.url = config.prefixUrl + config.url;
    return config;

    // const store = useStore();
    // if (config.sync) store.startSpinning()
    // CancelHandler.cancel(config);
    // const token = storage.token;
    // if (token) {
    //     if (config.headers) config.headers.authorization = token;
    //     return config;
    // }
    // return config;
})

// 响应拦截
// instance.interceptors.response.use(({ config, data }) => {
    // if (data.code !== 'C-200') throw data;
    // return data.data;
    // console.log(data);

    // return data;
    // const store = useStore();
    // if (config.sync) store.finishSpinning()
    // CancelHandler.remove(config);
    // if (config.notStdResponse) return data;

    // if (data.code !== 'C-000') {
    //     // 权限不足
    //     if (data.code === 'C-006') router.replace('/401');
    //     else if (!config.hideMessage) store.pushMessage(data.msg)
    //     throw data;
    // }
    // return data.context;
// }, err => {
    // console.log(err);
    // const store = useStore();
    // if (err?.config?.sync) store.finishSpinning()
    // if (err.code !== "ERR_CANCELED") store.pushMessage(err?.response?.data || err?.message || '请求异常中断');
    // throw err;
// })

interface AxiosInstance extends Axios {
    (config: AxiosRequestConfig): any;
    (url: string, config?: AxiosRequestConfig): any;
}

export default instance as AxiosInstance