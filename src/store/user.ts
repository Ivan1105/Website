// 用户信息状态
import { defineStore } from "pinia";

interface userData {
    nickname: string;
    sign: string;
}

export const useUserStore = defineStore('user', () => {
    /** 用户登录信息 */
    const userData = ref<userData | null>(null);

    return {
        userData
    }
});