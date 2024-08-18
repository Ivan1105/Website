import axios from "@/utils/axios";

const prefixUrl = '/Conf';

export type SysMenuNavi = {
    /** 菜单id */
    navi_id: number;
    /** 菜单标题 */
    title: string;
    /** 层级 */
    level: number;
    /** 菜单路径 */
    path: string;
    /** 父级菜单id */
    p_id: number;
    /** 权限控制 */
    permission: number;
    /** 是否启用 */
    is_use: number;
    /** 排序 */
    order: number;
};

export async function listNaviMenus(): Promise<SysMenuNavi[]> {
    return await axios.get('/listNaviMenus', { prefixUrl });
}