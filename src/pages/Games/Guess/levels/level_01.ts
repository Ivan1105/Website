import { SrcType } from ".";

export const urls = {
    base: {
        src: 'base',
        zindex: 1,
    },
    bra: {
        src: 'bra',
        zindex: 2,
    },
    pants: {
        src: 'pants',
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
    sweet1: {
        src: 'sweet1',
        zindex: 4
    },
    sweet2: {
        src: 'sweet2',
        zindex: 4,
    },
    fog: {
        src: 'fog',
        zindex: 4,
    },
    nipple: {
        src: 'nipple',
        zindex: 5,
    },
    vaginal: {
        src: 'vaginal',
        zindex: 5,
    },
    belt: {
        src: 'belt',
        zindex: 6,
    },
    coat: {
        src: 'coat',
        zindex: 7
    }
};
type SrcKey = keyof typeof urls;
export const stageInfo: Partial<Record<SrcType, SrcKey[]>>[] = [
    {
        appear: ['base', 'bra', 'pants', 'emotion1', 'belt', 'coat']
    },
    {
        hide: ['coat']
    },
    {
        show: ['sweet1'],
        hide: ['belt'],
        appear: ['emotion3'],
        disappear: ['emotion1']
    },
    {
        hide: ['bra'],
        show: ['nipple']
    },
    {
        hide: ['pants'],
        show: ['vaginal', 'fog', 'sweet2'],
        appear: ['emotion2'],
        disappear: ['emotion3']
    }
]

