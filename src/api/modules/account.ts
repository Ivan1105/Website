import { axios, path } from "@/utils";

/**
 * 获取关注列表
 * @param type 
 * @returns 
 */
export const getFollow = function (type?: string) {
    let apiUrl = "";
    if (type === "Followers") apiUrl = "/account/getFollowers";
    else if (type === "Following") apiUrl = "/account/getFollowing";
    else throw new Error('unknown param type');

    return axios(apiUrl, {
        method: "get",
    }).then((res) => {
        res.forEach((v: any) => {
            v.icon = path.icon(v.icon);
        });
        return res;
    });
}

export interface UserDetail {
    username: string;
    icon: string;
    follows: number;
    fans: number;
    following: boolean;
}

/** 获取用户信息 */
export const getUserDetail = async function (uid?: string) {
    if (!uid) uid = "";
    return axios(`/account/getUserDetail/${uid}`, {
        method: 'get'
    }).then((res: UserDetail) => {
        res.icon = path.icon(res.icon);
        return res;
    })
};

/** 触发动作按钮 */
export const operateOthers = async function (action: "follow" | "unfollow", uid: string | number) {
    await axios("/account/operateOthers", {
        method: "post",
        data: {
            uid,
            action,
        },
    })
};