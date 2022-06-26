import { axios, path } from "@/utils"

export interface userInfo {
    username: string;
    icon: string;
}

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
    ).then((res: userInfo) => {
        res.icon = path.icon(res.icon);
        return res;
    })
}