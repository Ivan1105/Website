import sakuraPng from './sakura.png';
import snowPng from './snow.png';

/** 图片资源 */
const resources = {
    sakuraImg: new Image(),
    snowImg: new Image()
}
resources.sakuraImg.src = sakuraPng;
resources.snowImg.src = snowPng;

/**
 * 资源预加载
 */
function preloadResources(): Promise<void> {
    return new Promise((resolve, reject) => {
        let preloadNums = Object.getOwnPropertyNames(resources).length;
        Object.entries(resources).forEach(resource => {
            const v = resource[1];
            if (v.complete) {
                preloadNums--;
                if (preloadNums === 0) resolve();
            }
            else {
                v.onload = () => {
                    preloadNums--;
                    if (preloadNums === 0) resolve();
                }
            }
            v.onerror = () => {
                reject();
            }
        })
    })
}

/**
 * 各种效果粒子的基类
 */
abstract class Effect {
    /** 横坐标 */
    protected x = 0;
    /** 纵坐标 */
    protected y = 0;
    /** 画布宽度 */
    protected w: number;
    /** 画布高度 */
    protected h: number;

    public constructor(w: number, h: number) {
        this.w = w;
        this.h = h;
    }

    /** 更新运动状态 */
    public abstract update(): void;
    /** 渲染粒子 */
    public abstract render(ctx: CanvasRenderingContext2D): void;
}

/**
 * 雨滴粒子
 */
class Rain extends Effect {
    /** 雨点的长度 */
    private len = 100;
    /** 倾斜角度 */
    private angle = -20;
    /** 下落速度 */
    private speed = 4;

    public constructor(w: number, h: number) {
        super(w, h);
        this.init();
    }

    /**
     * 初始化位置
     */
    private init(): void {
        this.x = Math.floor(Math.random() * (this.w - this.angle * this.h / this.len) * 1.2);
        this.y = -Math.floor(Math.random() * this.h + this.len);
    }

    public update(): void {
        this.x += Math.floor(this.angle / this.speed);
        this.y += Math.floor(this.len / this.speed);
        if (this.y >= this.h || this.x <= 0)
            this.init();
    }

    public render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        const color = ctx.createLinearGradient(this.x, this.y, this.x + this.angle, this.y + this.len);
        color.addColorStop(0, 'rgba(255,255,250,0.5)');
        color.addColorStop(1, 'rgba(255,255,255,0.1)');
        ctx.strokeStyle = color;

        ctx.beginPath()
        ctx.moveTo(this.x, this.y);
        ctx.lineWidth = 1.2;
        ctx.lineTo(this.x + this.angle, this.y + this.len);
        ctx.stroke();
        ctx.restore();
    }
}

/**
 * 樱花粒子
 */
class Sakura extends Effect {
    /** 樱花大小 */
    private s = 0;
    /** 旋转角度 */
    private r = 0;

    public constructor(w: number, h: number) {
        super(w, h);
        this.init(true);
    }

    /**
     * 初始化
     */
    private init(first = false) {
        this.s = Math.random();
        this.r = Math.random() * 6;

        if (first) {
            this.x = Math.random() * this.w;
            this.y = Math.random() * this.h;
        }
        else if (Math.random() > 0.4) {
            this.x = Math.random() * this.w;
            this.y = -this.r * 40;
        } else {
            this.x = this.w + this.r * 40;
            this.y = Math.random() * this.h;
        }
    }

    public update() {
        this.x = this.x + 0.5 * (-0.5 + Math.random() * 1) - 1.7;
        this.y = this.y + 1.5 + Math.random() * 0.7;
        this.r = this.r + Math.random() * 0.03;

        // 如果樱花越界, 重新调整位置
        if (this.x < -this.s * 40 || this.y > this.h) {
            this.init();
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.r);
        ctx.drawImage(resources.sakuraImg, 0, 0, 40 * this.s, 40 * this.s);
        ctx.restore();
    }
}

class Snow extends Effect {
    /** 雪花半径 */
    private r = 0;
    /** 雪花颜色 */
    private color = '';
    /** 水平运动速度 */
    private vx = 0;
    /** 是否为大雪花 */
    private special = false;
    /** 旋转角度 */
    private rotate = 0;
    /** 角速度 */
    private rotateSpeed = 0;

    public constructor(w: number, h: number) {
        super(w, h);
        this.init(true);
    }

    /**
     * 初始化
     */
    private init(first = false) {
        this.x = Math.random() * this.w;
        this.vx = Math.random() >= 0.5 ? 1 : -1;
        if (first)
            this.y = Math.random() * this.h;
        else
            this.y = 0;
        if (Math.random() < 0.02)
            this.special = true;
        this.rotate = Math.random() * 6;
        this.rotateSpeed = Math.random() * 0.05;

        this.r = Math.random() * 5;
        this.color = `rgba(255,255,255,${Math.random()})`;
    }

    public update(): void {
        this.x = this.x + this.vx;
        this.y = this.y + this.r / 2;
        this.rotate += this.rotateSpeed;

        if (this.y > this.h)
            this.init();
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotate);
        if (this.special)
            ctx.drawImage(resources.snowImg, -this.r * 5, -this.r * 5, this.r * 10, this.r * 10);
        else {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(0, 0, this.r, 0, 2 * Math.PI, false);
            ctx.fill();
        }
        ctx.restore();
    }
}

export default class Application {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private w = 0;
    private h = 0;
    private objects: Effect[] = [];
    private frame = 0;

    private rainNums = 0;
    private sakuraNums = 0;
    private snowNums = 0;

    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        let timer: NodeJS.Timeout;
        window.onresize = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                this.resize();
            }, 100);
        }
    }

    /**
     * 重新调整画布大小
     */
    private resize() {
        if (this.canvas.parentElement) {
            this.canvas.width = this.canvas.parentElement.offsetWidth;
            this.canvas.height = this.canvas.parentElement.offsetHeight;
        }
        this.w = this.canvas.width;
        this.h = this.canvas.height;

        // 重新创建粒子
        this.objects.splice(0, this.objects.length);
        for (let i = 0; i < this.rainNums * (this.w / 1600); i++) {
            this.objects.push(new Rain(this.w, this.h));
        }
        for (let i = 0; i < this.sakuraNums * (this.w / 1600); i++) {
            this.objects.push(new Sakura(this.w, this.h));
        }
        for (let i = 0; i < this.snowNums * (this.w / 1600); i++) {
            this.objects.push(new Snow(this.w, this.h));
        }
    }

    /**
     * 创建新的雨滴效果
     * @param count 数量
     */
    public createRains(count: number) {
        this.rainNums = count;
    }

    /**
     * 创建新的樱花效果
     * @param count 数量
     */
    public createSakuras(count: number) {
        this.sakuraNums = count;
    }

    public createSnows(count: number) {
        this.snowNums = count;
    }

    /**
     * 渲染列表
     */
    private render() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.objects.forEach(v => {
            v.update();
            v.render(this.ctx);
        });
        this.frame = requestAnimationFrame(this.render.bind(this));
    }

    public clear() {
        this.rainNums = this.sakuraNums = this.snowNums = 0;
    }

    /**
     * 开始渲染
     */
    public start() {
        this.resize();
        preloadResources().then(() => {
            this.frame = requestAnimationFrame(this.render.bind(this));
        })
    }

    public stop() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        cancelAnimationFrame(this.frame);
    }
}

