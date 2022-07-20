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
                @finish="() => { currentStatus = netStatus.playing; nextTick(addLog) }" />
            秒后开始
        </n-p>
    </div>

    <div v-else-if="currentStatus === netStatus.playing" class="playing full-height">
        <n-el tag="div" class="state-container">
            <n-h3>本场战况</n-h3>
            <n-p>对手剩余血量：{{ info.opponent.hp }}</n-p>
            <n-p>对手手牌总和：{{ cardSum.opponent.value }}</n-p>
            <n-p>失败时受到伤害：{{ Math.max(info.opponent.atk - info.my.def, 0) }}</n-p>
            <n-p>胜利时造成伤害：{{ Math.max(info.my.atk - info.opponent.def, 0) }}</n-p>
            <n-p>我的手牌总和：{{ cardSum.my.value }}</n-p>
            <n-p>我的剩余血量：{{ info.my.hp }}</n-p>
        </n-el>
        <div class="main-container">
            <div class="opponent-container">
                <div class="card-container">
                    卡牌：
                    <span class="card" v-for="(card, index) in info.opponent.numberCards" :key="index">
                        {{ card.show ? card.value : '(?)' }}
                    </span>
                </div>
                <div class="item-container">道具：</div>
            </div>
            <div ref="logContainer" class="log-container">
                <p>对手使用了道具【挑战24点】-在场上时：本局将以24点为目标，场上有多张挑战牌时，最后打出的一张生效</p>
                <p v-for="(log, index) in logList" :key="index">{{ log }}</p>
            </div>
            <div class="my-container">
                <n-space v-if="info.isMyTurn" class="action-container">
                    <n-button type="primary" @click="sendMessage({ key: 'draw' })">抽一张牌</n-button>
                    <n-button @click="sendMessage({ key: 'noMore' })">停止抽牌</n-button>
                </n-space>
                <div class="item-container">道具：</div>
                <div class="card-container">
                    卡牌：
                    <span class="card" v-for="(card, index) in info.my.numberCards" :key="index">
                        {{ card.show ? card.value : `(${card.value})` }}
                    </span>
                </div>
            </div>
        </div>
        <n-el tag="div" class="items-container">
            <n-h3>我的道具</n-h3>
            <n-tooltip placement="left" trigger="hover" v-for="item in info.my.itemCards" :key="item.id">
                <template #trigger>
                    <n-button class="item" block @click="sendMessage({ key: 'useItem', id: item.id })">
                        【{{ item.name }}】
                    </n-button>
                </template>
                {{ item.description }}
            </n-tooltip>
        </n-el>
    </div>

    <div v-else-if="currentStatus === netStatus.closed" class="closed full-height">
        <n-result title="Thank you for playing">
            <template #icon>
                这里或许会有个彩蛋
            </template>
            <template #footer>
                <n-button @click="currentStatus = netStatus.home">重新开始</n-button>
            </template>
        </n-result>
    </div>

    <div v-else class="error full-height">
        <n-result status="500" :title="errorReason"></n-result>
    </div>
</template>

<script lang="ts" setup>
import { inject, nextTick, ref, Ref, reactive } from 'vue';
import { Message, AllInfo, PID, ItemInfo } from './declare/Message';
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
    closed: Symbol('closed'),
    /** 连接发生错误 */
    error: Symbol('error')
}
/** 当前连接状态 */
let currentStatus = ref(netStatus.home);
// currentStatus.value = netStatus.playing;
// currentStatus.value = netStatus.closed
/** 游戏服务器地址 */
const websocketUrl = `${process.env.VUE_APP_WS_URL}blackjack`;
/** 错误原因 */
const errorReason = ref('');
let ws: WebSocket | null = null;
/** 发送消息到服务器 */
const sendMessage = function (data: Action) {
    ws?.send(JSON.stringify(data));
}

/** 渲染倒计时内容 */
const renderCountdown: CountdownProps['render'] = ({ seconds }) => {
    return String(seconds + 1);
}
/** 日志记录 */
const logList: string[] = reactive([]);
const logContainer: Ref<null | HTMLElement> = ref(null);
const addLog = function (s?: string) {
    if (s) logList.push(s);
    nextTick(() => {
        logContainer.value?.scrollTo({ top: logContainer.value.scrollHeight, behavior: 'smooth' })
    })
}

const isMyPid = function (pid: PID) {
    return pid === userInfo.uid;
}
const info: Ref<AllInfo> = ref({
    my: {
        numberCards: [
            {
                value: 6,
                show: false
            },
            {
                value: 2,
                show: true
            }
        ],
        items: [],
        hp: 5,
        atk: 1,
        def: 0,
        itemCards: [
            {
                id: 1,
                name: "测试道具",
                description: "为对手+1生命值"
            },
            {
                id: 2,
                name: "测试道具",
                description: "为对手+1生命值"
            },
            {
                id: 3,
                name: "测试道具",
                description: "为对手+1生命值"
            },
            {
                id: 4,
                name: "测试道具",
                description: "为对手+1生命值"
            }
        ]
    },
    opponent: {
        numberCards: [
            {
                show: false
            },
            {
                show: true,
                value: 11
            }
        ],
        items: [],
        hp: 5,
        atk: 1,
        def: 0
    },
    isMyTurn: false
});

/** 手牌总和 */
const cardSum = {
    opponent: computed(() => {
        let res = 0, hidden = false;
        info.value.opponent.numberCards.forEach(card => {
            if (card.value === undefined) hidden = true;
            res += card.value || 0;
        })
        if (hidden) return `? + ${res}`;
        else return res;
    }),
    my: computed(() => {
        let res = 0;
        info.value.my.numberCards.forEach(card => {
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
    ws.onclose = function ({ code, reason }) {
        ws = null;
        if (code === 1000) {
            setTimeout(() => {
                currentStatus.value = netStatus.closed;
            }, 5000);
            return;
        }
        errorReason.value = reason || '连接已断开';
        currentStatus.value = netStatus.error;
    }
    ws.onerror = function () {
        ws = null;
        errorReason.value = '连接游戏服务器失败';
        currentStatus.value = netStatus.error;
    }

    ws.onmessage = function ({ data }) {
        const message: Message = JSON.parse(data);

        switch (message.key) {
            case 'ready':
                currentStatus.value = netStatus.ready;
                info.value = message.gameInfo;
                sendMessage({ key: 'ready' });
                addLog('准备就绪');
                break;
            case 'drawNumber':
                if (isMyPid(message.pid)) info.value.my.numberCards.push(message.card);
                else info.value.opponent.numberCards.push(message.card);
                break;
            case 'withdrawNumber':
                if (isMyPid(message.pid)) info.value.my.numberCards.pop();
                else info.value.opponent.numberCards.pop();
                break;
            case 'drawItem':
                if (isMyPid(message.pid)) {
                    info.value.my.itemCards?.push(message.card!);
                    addLog('你抽到了一张道具');
                }
                else addLog('对手抽到了一张道具');
                break;
            case 'hpChange':
                if (isMyPid(message.pid)) info.value.my.hp = message.currentValue;
                else info.value.opponent.hp = message.currentValue;
                break;
            case 'atkChange':
                if (isMyPid(message.pid)) info.value.my.atk = message.currentValue;
                else info.value.opponent.atk = message.currentValue;
                break;
            case 'defChange':
                if (isMyPid(message.pid)) info.value.my.def = message.currentValue;
                else info.value.opponent.def = message.currentValue;
                break;
            case 'targetChange':
                addLog(`本次对局的目标更改为${message.currentValue}点`);
                break;
            case 'useItem':
                if (isMyPid(message.pid)) {
                    info.value.my.itemCards?.forEach(item => {
                        if (item.id === message.card.id)
                            info.value.my.itemCards?.splice(info.value.my.itemCards.indexOf(item), 1);
                    })
                    addLog(`你使用了道具【${message.card.name}】-${message.card.description}`);
                }
                else addLog(`对手使用了道具【${message.card.name}】-${message.card.description}`);
                break;
            case 'roundEnd':
                info.value.opponent.numberCards[0].show = true;
                info.value.opponent.numberCards[0].value = message.hiddenCard.value;
                addLog('本次对局结束');
                addLog(`对手共计${cardSum.opponent.value}点`);
                addLog(`你共计${cardSum.my.value}点`);
                if (isMyPid(message.winner)) addLog('你赢了');
                else addLog('你输了');
                break;
            case 'phaseStart':
                if (isMyPid(message.pid)) {
                    addLog('你的回合');
                    info.value.isMyTurn = true;
                }
                break;
            case 'noMoreCard':
                if (!isMyPid(message.pid)) addLog('对手停止进牌了');
                break;
            case 'phaseEnd':
                if (isMyPid(message.pid)) info.value.isMyTurn = false;
                break;
            case 'roundStart':
                info.value = message.gameInfo;
                addLog('新的对局开始了，加油！');
                break;
        }
    }
}

</script>

<style lang="scss" scoped>
@import './index';
</style>