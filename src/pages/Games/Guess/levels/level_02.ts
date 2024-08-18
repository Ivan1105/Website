import { SrcType } from ".";

export const urls = {
    base: {
        src: 'base',
        zindex: 1,
    },
    bra1: {
        src: 'bra1',
        zindex: 2,
    },
    bra2: {
        src: 'bra2',
        zindex: 2,
    },
    pants1: {
        src: 'pants1',
        zindex: 2,
    },
    pants2: {
        src: 'pants2',
        zindex: 2,
    },
    stock: {
        src: 'stock',
        zindex: 2,
    },
    emotion1: {
        src: 'emotion1',
        zindex: 3
    },
    emotion2: {
        src: 'emotion2',
        zindex: 3,
    },
    emotion3: {
        src: 'emotion3',
        zindex: 3,
    },
    emotion4: {
        src: 'emotion4',
        zindex: 3,
    },
    // sweet1: {
    //     src: 'sweet1',
    //     zindex: 4
    // },
    // sweet2: {
    //     src: 'sweet2',
    //     zindex: 4,
    // },
    // fog: {
    //     src: 'fog',
    //     zindex: 4,
    // },
    nipple1: {
        src: 'nipple1',
        zindex: 5,
    },
    nipple2: {
        src: 'nipple2',
        zindex: 5,
    },
    vaginal1: {
        src: 'vaginal1',
        zindex: 5,
    },
    vaginal2: {
        src: 'vaginal2',
        zindex: 5,
    }
};
type SrcKey = keyof typeof urls;
export const stageInfo: Partial<Record<SrcType, SrcKey[]>>[] = [
    {
        appear: ['base', 'emotion1', 'emotion3', 'bra1', 'bra2', 'pants1', 'pants2', 'stock']
    },
    {
        hide: ['stock']
    },
    {
        show: ['nipple1'],
        hide: ['bra1']
    },
    {
        show: ['nipple2'],
        hide: ['bra2']
    },
    {
        show: ['vaginal1'],
        hide: ['pants1'],
        appear: ['emotion2'],
        disappear: ['emotion1']
    },
    {
        show: ['vaginal2'],
        hide: ['pants2'],
        appear: ['emotion4'],
        disappear: ['emotion3']
    }
]

