import { axios, path } from "@/utils"

/**
 * 获取用户信息
 * @returns 
 */
export const getUser = function () {
    return axios(
        "/user/getUser",
        {
            method: "get",
        },
        false
    ).then((res: UserInfo) => {
        res.icon = path.icon(res.icon!);
        return res;
    })
}