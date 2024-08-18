import axios from "@/utils/axios";

const prefixUrl = '/GameList';

export type GameMainList = Partial<{
    game_id: number; // 
    name: string; // 游戏名
    platforms: number; // 发售平台
    release_year: string; // 发售年份
    release_month: string; // 发售月份
    release_day: string; // 发售日期
    release_note: string; // 发售日期说明
    cover_url: string; // 封面
    produce_org: string; // 开发商
    release_org: string; // 发行商
}>;

export async function listGames(): Promise<GameMainList[]> {
    return await axios.get('/listGames', { prefixUrl });
}

export async function listGamesByPage(params: PageParams<GameMainList>): Promise<PageResult<GameMainList>> {
    return await axios.post('/listGamesByPage', params, { prefixUrl });
}

export async function updateGameInfo(params: GameMainList): Promise<number> {
    return await axios.post('/updateGameInfo', params, { prefixUrl });
}

export async function removeGame(params: GameMainList) {
    return await axios.post('/removeGame', params, { prefixUrl });
}