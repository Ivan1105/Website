<template>
    <div v-if="currentStatus === netStatus.home" class="home full-height">
        <n-h2>Black Jack - 文字特供版</n-h2>
        <n-button type="primary" @click="handleGameStart">开始摸鱼</n-button>
        <n-button>规则介绍</n-button>
    </div>
    <div v-else-if="[netStatus.waiting, netStatus.ready].includes(currentStatus)" class="waiting full-height">
        <p class="loading">【加载动画】</p>
        <n-p v-if="currentStatus === netStatus.waiting">等待对手加入游戏(1/2)</n-p>
        <n-p v-else>
            准备就绪，游戏将在
            <n-countdown :duration="3000" :render="renderCountdown"
                @finish="() => { currentStatus = netStatus.playing }" />
            秒后开始
        </n-p>
    </div>
    <div v-else-if="currentStatus === netStatus.playing" class="playing full-height">
        <div class="opponent-container">
            <div class="card-container">
                卡牌：
                <span v-for="(card, index) in info.opponent.numberCards" :key="index">
                    {{ card.show ? card.value : '(?)' }}
                </span>
            </div>
            <div class="item-container">道具：</div>
        </div>
        <div class="my-container">
            <n-space v-if="isMyTurn" class="action-container">
                <n-button type="primary">抽一张牌</n-button>
                <n-button>停止抽牌</n-button>
            </n-space>
            <div class="item-container">道具：</div>
            <div class="card-container">
                卡牌：
                <span v-for="(card, index) in info.my.numberCards" :key="index">
                    {{ card.show ? card.value : `(${card.value})` }}
                </span>
            </div>
        </div>
        <n-el tag="div" class="state-container">
            <n-h3>本场战况</n-h3>
            <n-p>对手剩余血量：{{ info.opponent.hp }}</n-p>
            <n-p>对手手牌总和：{{ cardSum.opponent.value }}</n-p>
            <n-p>我的手牌总和：{{ cardSum.my }}</n-p>
            <n-p>我的剩余血量：{{ info.my.hp }}</n-p>
        </n-el>
        <n-el tag="div" class="items-container">
            <n-h3>我的道具</n-h3>
            <n-tooltip placement="left" trigger="hover" v-for="item in info.my.itemCards" :key="item.id">
                <template #trigger>
                    <n-button>【{{ item.name }}】</n-button>
                </template>
                {{ item.description }}
            </n-tooltip>
        </n-el>
    </div>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue';
import { Message, AllInfo, PID } from './declare/Message';
import { Action } from './declare/Action'
import { CountdownProps } from 'naive-ui';
import { computed } from '@vue/reactivity';
import { injection } from '@/utils';

const userInfo = inject(injection.userInfoKey)!;

/** 连接状态表 */
const netStatus = {
    /** 未进入连接 */
    home: Symbol('home'),
    /** 等待对手加入 */
    waiting: Symbol('waiting'),
    /** 就绪 */
    ready: Symbol('ready'),
    /** 游戏进行中 */
    playing: Symbol('playing'),
    /** 连接已关闭 */
    closed: Symbol('closed')
}
/** 当前连接状态 */
let currentStatus = ref(netStatus.home);
currentStatus.value = netStatus.playing;
/** 游戏服务器地址 */
const websocketUrl = `${process.env.VUE_APP_WS_URL}blackjack`;
let ws: WebSocket | null = null;
/** 发送消息到服务器 */
const sendMessage = function (data: Action) {
    ws?.send(JSON.stringify(data));
}

/** 渲染倒计时内容 */
const renderCountdown: CountdownProps['render'] = ({ seconds }) => {
    return String(seconds + 1);
}

const isMyTurn = ref(false);
const isMyPid = function (pid: PID) {
    return pid === userInfo.uid;
}
let info: AllInfo = {
    "my": {
        "numberCards": [
            {
                "value": 6,
                "show": false
            },
            {
                "value": 2,
                "show": true
            }
        ],
        "items": [],
        "hp": 5,
        "itemCards": [
            {
                "id": 1,
                "name": "测试道具",
                "description": "为对手+1生命值"
            },
            {
                "id": 2,
                "name": "测试道具",
                "description": "为对手+1生命值"
            },
            {
                "id": 3,
                "name": "测试道具",
                "description": "为对手+1生命值"
            },
            {
                "id": 4,
                "name": "测试道具",
                "description": "为对手+1生命值"
            }
        ]
    },
    "opponent": {
        "numberCards": [
            {
                "show": false
            },
            {
                "show": true,
                "value": 11
            }
        ],
        "items": [],
        "hp": 5
    }
};

/** 手牌总和 */
const cardSum = {
    opponent: computed(() => {
        let res = 0, hidden = false;
        info.opponent.numberCards.forEach(card => {
            if (card.value === undefined) hidden = true;
            res += card.value || 0;
        })
        if (hidden) return `? + ${res}`;
        else return res;
    }),
    my: computed(() => {
        let res = 0;
        info.my.numberCards.forEach(card => {
            res += card.value || 0;
        })
        return res;
    })
}
/** 开始游戏 */
const handleGameStart = function () {
    if (ws !== null) return;

    ws = new WebSocket(websocketUrl);
    ws.onopen = function () {
        sendMessage({ key: 'bearer', token: localStorage.getItem('authorization') || sessionStorage.getItem('authorization') || '' })
        currentStatus.value = netStatus.waiting;
    }
    ws.onclose = function (ev) {
        console.log(ev);
        window.message?.error('连接已断开');
    }
    ws.onerror = function () {
        window.message?.error('连接游戏服务器失败');
    }

    ws.onmessage = function ({ data }) {
        const message: Message = JSON.parse(data);

        switch (message.key) {
            case 'ready':
                currentStatus.value = netStatus.ready;
                sendMessage({ key: 'ready' })
                break;
            case 'drawNumber':
                if (isMyPid(message.pid)) info.my.numberCards.push(message.card);
                else info.opponent.numberCards.push(message.card);
                break;
        }
    }
}

</script>

<style lang="scss" scoped>
@import './index';
</style>