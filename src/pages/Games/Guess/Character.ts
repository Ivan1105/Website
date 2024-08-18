import { zrender, Bullet, BulletEnemy, BulletPlayer, COLUMNS, COLUMN_X, MOVE_SPEED, SHOOT_GAP, SHOOT_SPEED, Z_LEVELS, copyObj, zr } from ".";

interface CharacterProps {
    maxLife: number;
    attack: number;
    /** 子弹飞行速度 */
    shootSpeed: number;
    /** 射击间隔 */
    shootGap: number;
    zlevel?: number;
}
export abstract class Character {
    protected life = 0;
    protected maxLife = 0;
    protected column = 0;
    protected shootSpeed = 0;
    protected shootGap = 0;
    protected zlevel = Z_LEVELS.character;
    private _box: zrender.BoundingRect | null = null;

    /** 攻击力 */
    public attack = 0;

    /** 上一次射击的时间 */
    protected lastShoot = 0;
    /** 射击目标 */
    private _shootTarget: Character | null = null;

    protected abstract bullets: Bullet[];
    protected abstract el: zrender.Rect;
    public readonly abstract y: number;

    public get x() {
        return COLUMN_X(this.column);
    }

    /** 射击的冷却时间 */
    protected get coolTime() {
        return SHOOT_GAP[this.shootGap] || SHOOT_GAP.at(-1);
    }

    /** 获取碰撞盒子 */
    public get box() {
        const { x, y, width, height } = this.el.shape;
        if (!this._box) this._box = new zrender.BoundingRect(x, y, width, height);
        this._box.copy({ x, y, width, height });
        return this._box;
    }

    constructor(obj: CharacterProps) {
        copyObj(this, obj);
        this.life = this.maxLife;
    }

    public abstract update(): void;

    /** 伤害或回复 */
    public setLife(life: number) {
        this.life += life;
        if (this.life > this.maxLife) this.life = this.maxLife;
        if (this.life < 0) this.life = 0;
        console.log(`Current Life: ${this.life}`);
    }
    /** 获取生命值 */
    public getLife() {
        return { life: this.life, maxLife: this.maxLife };
    }

    /** 射击目标 */
    protected get shootTarget() {
        const target = this._shootTarget;
        if (!target) return null;
        const time = Date.now();
        if (time - this.lastShoot < this.coolTime) return null;
        this.lastShoot = time;
        return target;
    }

    /** 射击 */
    protected abstract shoot(): void;
    /** 开始射击 */
    public startShoot(target: Character) {
        this._shootTarget = target;
    }
    /** 结束射击 */
    public stopShoot() {
        this._shootTarget = null;
    }

    /** 清空子弹 */
    public removeBullets(removeAll = false) {
        if (removeAll) {
            this.bullets.forEach(bullet => { bullet.destroy() });
            this.bullets = [];
        }
        this.bullets = this.bullets.filter(({ destroyed }) => !destroyed);
    }

    /** 向左移动 */
    public moveLeft() {
        if (this.column > 0) this.column--;
    }
    /** 向右移动 */
    public moveRight() {
        if (this.column < COLUMNS - 1) this.column++;
    }
    /** 移动至 */
    public moveTo(column: number) {
        if (column < 0 || column >= COLUMNS) return;
        this.column = column;
    }

    /** 销毁 */
    public destroy() {
        this.removeBullets(true);
        zr.value.remove(this.el);
    }
}

/** 玩家角色 */
export class Player extends Character {
    protected bullets: BulletPlayer[] = [];
    protected el: zrender.Rect;
    public readonly y: number;

    constructor(obj: CharacterProps) {
        super(obj);
        this.y = zr.value.getHeight()! - 25;
        this.el = new zrender.Rect({
            style: {
                fill: '#000'
            },
            zlevel: this.zlevel
        });
        this.update();
        zr.value.add(this.el);
    }

    public update(): void {
        this.el.attr('shape', {
            x: this.x - 25 / 2,
            y: this.y,
            width: 25,
            height: 25
        });

        this.shoot();
    }

    protected shoot(): void {
        const target = this.shootTarget;
        if (!target) return;

        const bullet = new BulletPlayer({
            column: this.column,
            width: 10,
            height: 25,
            speed: this.shootSpeed,
            y: this.y,
            self: this,
            target
        });
        this.removeBullets();
        this.bullets.push(bullet);
    }
}

interface EnemyProps extends CharacterProps {
    /** 移动频率 */
    moveSpeed: number;
}
/** 敌人角色 */
export class Enemy extends Character {
    protected bullets: BulletEnemy[] = [];
    protected el: zrender.Rect;
    public readonly y: number;

    private moveSpeed = 0;
    /** 移动频率 */
    private get moveCD() {
        return MOVE_SPEED[this.moveSpeed] || MOVE_SPEED.at(-1);
    }
    private lastMoveTime = 0;

    constructor(obj: EnemyProps) {
        super(obj);
        copyObj(this, obj);
        this.y = 0;
        this.el = new zrender.Rect({
            style: {
                fill: '#000'
            },
            zlevel: this.zlevel
        });
        this.update();
        zr.value.add(this.el);
    }

    /** 随机移动 */
    private randomMove() {
        // const time = Date.now();
        // if (time - this.lastMoveTime < this.moveCD) return;
        // this.lastMoveTime = time;
        // this.moveTo((Math.random() * COLUMNS) | 0);
    }

    public update(): void {
        this.el.attr('shape', {
            x: this.x - 25 / 2,
            y: this.y,
            width: 25,
            height: 25
        });
        this.randomMove();
        this.shoot();
    }

    protected shoot(): void {
        const target = this.shootTarget;
        if (!target) return;

        const bullet = new BulletEnemy({
            column: this.column,
            y: this.y,
            size: 25,
            size0: 10,
            speed: this.shootSpeed,
            self: this,
            target
        });
        this.removeBullets();
        this.bullets.push(bullet);
    }
}