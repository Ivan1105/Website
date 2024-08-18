// 用户信息状态
import { defineStore } from "pinia";

interface UserData {
    nickname: string;
    sign: string;
}

export const useUserStore = defineStore('user', () => {
    /** 用户登录信息 */
    const userData = ref<UserData | null>(null);

    return {
        userData
    }
});