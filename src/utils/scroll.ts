/**
 * 使用动画滚动导航部分
 * @param end {Number} 滚动结束的位置
 */
export const scrollTo = (end: number): Promise<void> => {
    const el = document.documentElement;
    let start = el.scrollTop;

    return new Promise((resolve) => {
        const _scrollTo = function (end: number, step: number) {
            if (start < end) {
                start = start + step;
                if (start > end) {
                    start = end;
                }
            }
            if (start > end) {
                start = start - step;
                if (start < end) {
                    start = end;
                }
            }

            el.scrollTo({
                top: start,
                behavior: 'auto'
            });

            if (start !== end) {
                requestAnimationFrame(() => {
                    _scrollTo(end, step);
                })
            }
            else resolve();
        }
        const step = (start - end) / 30;
        _scrollTo(end, step)
    })
};