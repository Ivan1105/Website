namespace ActionNamespace {
    interface Bearer {
        key: 'bearer';
        token: string;
    }
    interface UseItem {
        key: 'useItem';
        id: number;
    }
    interface Others {
        key: 'draw' | 'noMore' | 'ready';
    }

    /** 玩家的操作 */
    export type Type = Bearer | UseItem | Others;
}

export type Action = ActionNamespace.Type