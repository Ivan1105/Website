import axios, { AxiosRequestConfig } from 'axios'

const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 10000,
    maxContentLength: 10240,
    maxRedirects: 5,
    headers: { 'Content-Type': 'application/json' }
})

instance.interceptors.request.use(config => {
    const token = window.sessionStorage.getItem('authorization') || window.localStorage.getItem('authorization');
    if (token) {
        if (config.headers) config.headers.authorization = 'Bearer ' + token;
        return config;
    }
    else return config;
}, err => {
    window.message?.error('请求异常中断', err);
})

const http = function (url: string, config?: AxiosRequestConfig<any>, showMessage = true): Promise<any> {
    return instance(url, config).then(res => {
        if (process.env.NODE_ENV === 'development') {
            console.info('追踪路径 => ', url);
            console.info('获取数据 => ', res);
        }

        if (res.data.code !== 'C-000') {
            if(showMessage) window.message?.error(res.data.msg)
            throw res.data.msg;
        }
        return res.data.context;
    });
}

export default http