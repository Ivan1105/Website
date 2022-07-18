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
    atk: number;
    def: number;
}

/** 所有信息 */
export interface AllInfo {
    my: PlayerInfo;
    opponent: PlayerInfo;
}

namespace MessageNamespace {
    interface Ready {
        key: 'ready';
        opponentInfo: {
            pid: PID;
        }
        gameInfo: AllInfo;
    }
    interface DrawNumber {
        key: 'drawNumber' | 'withdrawNumber';
        pid: PID;
        card: NumberInfo;
    }
    interface DrawItem {
        key: 'drawItem';
        pid: PID;
        card?: ItemInfo;
    }
    interface ValueChange {
        key: 'hpChange' | 'atkChange' | 'defChange';
        pid: PID;
        currentValue: number;
    }
    interface TargetChange {
        key: 'targetChange';
        currentValue: number;
    }
    interface UseItem {
        key: 'useItem';
        pid: PID;
        card: ItemInfo;
    }
    interface RoundEnd {
        key: 'roundEnd';
        hiddenCard: NumberInfo;
        winner: PID;
    }
    interface OthersWithPid {
        key: 'phaseStart' | 'noMoreCard' | 'phaseEnd';
        pid: PID;
    }
    interface Others {
        key: 'roundStart';
    }
    export type Type = DrawNumber | DrawItem | ValueChange | TargetChange | UseItem | Ready | RoundEnd | OthersWithPid | Others;
}

export type Message = MessageNamespace.Type