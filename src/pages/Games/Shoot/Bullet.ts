import { zrender, COLUMN_X, Z_LEVELS, copyObj, zr, Character, Player, SHOOT_SPEED } from "./";

interface BulletProps {
    column: number;
    speed: number;
    self: Character;
    target: Character;
    y: number;
    zlevel?: number;
}
/** 子弹 */
export abstract class Bullet {
    protected x = 0;
    private speed = 0;

    protected abstract el: zrender.Element;
    protected anime: ReturnType<zrender.Element['animate']> | null = null;
    protected zlevel = Z_LEVELS.bullet;

    /** 是否已销毁 */
    public destroyed = false;

    /** 子弹动画时长 */
    protected get shootTime() {
        return SHOOT_SPEED[this.speed] || SHOOT_SPEED.at(-1);
    }

    constructor(obj: BulletProps) {
        copyObj(this, obj);
        this.x = COLUMN_X(obj.column);
    }

    /** 开始动画 */
    abstract startAnimation(from: Character, to: Character): void;
    /** 销毁 */
    public destroy() {
        this.anime?.stop();
        this.destroyed = true;
        zr.value.remove(this.el);
    }
}

interface BulletPlayerProps extends BulletProps {
    width: number;
    height: number;
}
/** 玩家的子弹 */
export class BulletPlayer extends Bullet {
    protected el: zrender.Rect;
    private width = 0;
    private height = 0;

    constructor(obj: BulletPlayerProps) {
        super(obj);
        copyObj(this, obj);

        this.el = new zrender.Rect({
            shape: {
                x: this.x - this.width / 2,
                y: obj.y - this.height,
                width: this.width,
                height: this.height
            },
            style: {
                fill: '#000'
            },
            zlevel: this.zlevel
        })
        zr.value.add(this.el);
        this.startAnimation(obj.self, obj.target);
    }

    public startAnimation(from: Character, to: Character) {
        this.anime = this.el.animate('shape', false).when(this.shootTime, { y: -this.height });
        this.anime.during(() => {
            const { x, y, width, height } = this.el.shape;
            if (to.box.intersect({ x, y, width, height })) {
                // console.log(true);
                to.setLife(-from.attack);
                this.destroy();
            }
        }).done(() => {
            console.log(false);
            this.destroy();
        });
        this.anime.start();
    }
}

interface BulletEnemyProps extends BulletProps {
    size: number;
    size0: number;
}
/** 敌人的子弹 */
export class BulletEnemy extends Bullet {
    private size = 0;
    private size0 = 0;
    protected el: zrender.Star;

    constructor(obj: BulletEnemyProps) {
        super(obj);
        copyObj(this, obj);

        this.el = new zrender.Star({
            shape: {
                cx: this.x,
                cy: obj.y + this.size,
                n: 4,
                r: this.size,
                r0: this.size0
            },
            style: {
                fill: '#000'
            },
            zlevel: this.zlevel
        })
        zr.value.add(this.el);
        this.startAnimation(obj.self, obj.target);
    }

    public startAnimation(from: Character, to: Character) {
        const anime = this.el.animate('shape', false).when(this.shootTime, { cy: zr.value.getHeight()! + this.size });
        anime.during(() => {
            const { cx, cy, r, r0 } = this.el.shape;
            const rect = {
                x: cx - r0,
                y: cy - r0,
                width: r0 * 2,
                height: r0 * 2,
            };
            if (to.box.intersect(rect)) {
                to.setLife(-from.attack);
                this.destroy();
            }
        }).done(() => {
            console.log(false);
            this.destroy();
        });
        anime.start();
    }
}