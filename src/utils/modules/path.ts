/** 将头像文件名解析成url */
export const icon = function (str: string) {
    return process.env.VUE_APP_API_URL + 'icons/' + str + '.jpg'
}