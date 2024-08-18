import { defineStore } from 'pinia';

export type OSSUrlType = keyof ReturnType<typeof useOssStore>['ossUrlPath'];
export const useOssStore = defineStore('oss', {
    state: () => {
        return {
            /** oss地址 */
            ossUrl: import.meta.env.VITE_OSS_URL as string,
            /** oss地址第二级可选项 */
            ossUrlPath: {
                /** 游戏工具的封面 */
                gamecovers: 'gamecovers',
                /** 用户头像 */
                icon: 'icon',
                /** 动态的图片 */
                timeline: 'image',
                /** 租房记录 */
                house: 'house',
                /** 图库 */
                photos: 'photos'
            }
        }
    },
    getters: {
        /** oss地址解析 */
        getSourceUrl: ({ ossUrl, ossUrlPath }) => (path: keyof typeof ossUrlPath, name: string) => {
            return `${ossUrl}${ossUrlPath[path]}/${name}`;
        }
    },
    actions: {
    },
});