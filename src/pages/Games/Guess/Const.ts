import { zrender } from '.';
// import * as zrender from 'zrender';

/** zrender实例 */
export const zr = {} as { value: ReturnType<typeof zrender.init> };

/** 一共4列 */
export const COLUMNS = 4;
/** 每列宽度 */
export const COLUMN_WIDTH = function () {
    return zr.value.getWidth()! / COLUMNS;
}
/** 每列的横坐标 */
export const COLUMN_X = function (i: number) {
    const colWidth = COLUMN_WIDTH();
    return colWidth * i + colWidth / 2;
}
/** z层 */
export const Z_LEVELS = {
    image: 100,
    base: 110,
    bullet: 200,
    character: 201,
    ui: 1000
} as const;

/** 射击速度 */
export const SHOOT_SPEED = [2500, 2000, 1500, 1250, 1000] as const;
/** 射击间隔 */
export const SHOOT_GAP = [666, 500, 450, 400, 333, 250] as const;
/** 敌人的移动频率 */
export const MOVE_SPEED = [2000, 1500, 1000, 666, 500] as const;

/** 赋值构造函数到this */
export const copyObj = function (a: any, b: {}) {
    Object.entries(b).forEach(([k, v]) => {
        if (k in a) {
            a[k] = v;
        }
    });
}