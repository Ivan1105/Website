import { axios, path } from "@/utils";

export interface Timeline {
    id: number;
    username: string;
    content: string;
    date: Date;
    icon: string;
}

export interface Counts {
    [day: number]: number;
}

/** 查询动态 */
export async function list({ uid, pageNum, pageSize }: { uid?: string, pageNum: number, pageSize: number }) {
    if (!uid) uid = '';
    const res: Timeline[] = await axios(`/timeline/list/${uid}?pageNum=${pageNum}&pageSize=${pageSize}`);
    res.forEach(v => {
        v.date = new Date(v.date);
        v.icon = path.icon(v.icon);
        // v.content = v.content.replace(/./g, '*');
    });
    return res;
}

/** 新增动态 */
export async function add(data: { content: string, privacy: number }) {
    const res: Timeline = await axios("/timeline/add", {
        method: "post",
        data,
    })
    res.date = new Date(res.date);
    res.icon = path.icon(res.icon);
    return res;
}

/** 移除动态 */
export async function remove(id: number) {
    await axios("/timeline/remove", {
        method: "post",
        data: { id },
    })
}

export async function countsByDate(data: { begin: string, end: string }) {
    const res: { date: Date }[] = await axios('/timeline/countsByDate', {
        method: 'post',
        data
    })
    const ans: Counts = {};
    res.forEach(({ date }) => {
        date = new Date(date);
        const day = date.getDate();
        if (ans[day] === undefined) ans[day] = 1;
        else ans[day]++;
    })
    return ans;
}