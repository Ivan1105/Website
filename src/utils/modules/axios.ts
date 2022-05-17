import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 10000,
    maxContentLength: 10240,
    maxRedirects: 5,
    headers: { 'Content-Type': 'application/json' }
})

instance.interceptors.request.use(config => {
    const token = window.localStorage.getItem('authorization');
    if (token) {
        if (config.headers) config.headers.authorization = 'Bearer ' + token;
        return config;
    }
    else return config;
}, err => {
    console.error(err);

})

export default instance