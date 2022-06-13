export const icon = function (str: string) {
    return process.env.VUE_APP_API_URL + 'icons/' + str.substring(1) + '.jpg'
}