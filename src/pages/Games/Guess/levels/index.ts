export type SrcType = 'show' | 'hide' | 'appear' | 'disappear';
export type UrlsType = Record<string, { src: string, zindex: number }>;
export type StageType = Partial<Record<SrcType, string[]>>[];

export async function getLevelInfo(level: string) {
    const res = await import('./' + level) as { urls: UrlsType, stageInfo: StageType };
    Object.values(res.urls).forEach(item => {
        item.src = `/Guess/${level}/${item.src}.png`;
    });
    return res;
}
