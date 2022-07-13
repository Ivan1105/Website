export type PID = string | number;

export interface NumberInfo {
    value?: number;
    show: boolean;
}

export interface ItemInfo {
    id: number;
    name: string;
    description: string;
}

export interface PlayerInfo {
    numberCards: NumberInfo[];
    itemCards?: ItemInfo[];
    items: ItemInfo[];
    hp: number;
}

/** 所有信息 */
export interface AllInfo {
    my: PlayerInfo;
    opponent: PlayerInfo;
}

namespace MessageNamespace {
    interface DrawNumber {
        key: 'drawNumber';
        pid: PID;
        card: NumberInfo;
    }
    interface DrawItem {
        key: 'drawItem';
        pid: PID;
        card?: ItemInfo;
    }
    interface HPChange {
        key: 'hpChange';
        pid: PID;
        currentHP: number;
    }
    interface UseItem {
        key: 'useItem';
        pid: PID;
        card: ItemInfo;
    }
    interface Ready {
        key: 'ready';
        opponentInfo: {
            pid: PID;
        }
        gameInfo: AllInfo;
    }
    interface RoundEnd {
        key: 'roundEnd';
        hiddenCard: NumberInfo;
    }
    interface OthersWithPid {
        key: 'phaseStart' | 'noMoreCard' | 'phaseEnd';
        pid: PID;
    }
    interface Others {
        key: 'roundStart';
    }
    export type Type = DrawNumber | DrawItem | HPChange | UseItem | Ready | RoundEnd | OthersWithPid | Others;
}

export type Message = MessageNamespace.Type