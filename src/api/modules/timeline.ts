import { axios } from "@/utils";

export interface Timeline {
    id: number;
    username: string;
    content: string;
    date: Date;
}

/** 查询动态 */
export async function list({ uid, pageNum, pageSize }: { uid?: string, pageNum: number, pageSize: number }) {
    if (!uid) uid = '';
    const res: Timeline[] = await axios(`/timeline/list/${uid}?pageNum=${pageNum}&pageSize=${pageSize}`);
    res.forEach(v => { v.date = new Date(v.date) });
    return res;
}

/** 新增动态 */
export async function add(content: string) {
    const res: Timeline = await axios("/timeline/add", {
        method: "post",
        data: { content },
    })
    res.date = new Date(res.date);
    return res;
}

export async function remove(id: number) {
    await axios("/timeline/remove", {
        method: "post",
        data: { id },
    })
}