<template>
  <n-radio-group v-model:value="tableType">
    <n-radio-button value="all" checked>显示所有</n-radio-button>
    <n-radio-button value="notBought">未购买的</n-radio-button>
    <n-radio-button value="bought">已购买的</n-radio-button>
  </n-radio-group>

  {{ $route.params.id }}

  <n-data-table
    :columns="columns"
    :data="data"
    :pagination="{ pageSize: 5 }"
    :row-props="rowProps"
  />
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from "@vue/runtime-core";
import { DataTableColumns } from "naive-ui";

/** 基础游戏信息 */
abstract class Game {
  /** 数据库唯一识别码 */
  id: number;
  /** 游戏名 */
  name: string;
  /** 登陆平台 */
  platforms: string[];
  /** 发行日期 */
  releaseDate?: Date;

  constructor(obj: Game) {
    this.id = obj.id;
    this.name = obj.name;
    this.platforms = obj.platforms;
    this.releaseDate = obj.releaseDate;
  }
}

/** 还没买的游戏信息 */
class NotBoughtGame extends Game {
  /** 重要程度 */
  priority: number;

  constructor(obj: NotBoughtGame) {
    super(obj);
    this.priority = obj.priority;
  }
}

/** 已经买的游戏信息 */
class BoughtGame extends Game {
  /** 购买日期 */
  boughtDate: Date;
  /** 游玩状态 */
  status: number;
  /** 通关日期 */
  clearDate: Date | null;
  /** 个人评分 */
  rate: number;
  /** 备注 */
  comment: string | null;

  constructor(obj: BoughtGame) {
    super(obj);
    this.boughtDate = obj.boughtDate;
    this.status = obj.status;
    this.clearDate = obj.clearDate;
    this.rate = obj.rate;
    this.comment = obj.comment;
  }
}

/** 表格显示的数据类别 */
const tableType: Ref<"all" | "notBought" | "bought"> = ref("all");

/** 表头数据 */
const columns = computed((): DataTableColumns => {
  const res: DataTableColumns = [
    {
      title: "游戏名",
      key: "name",
    },
    {
      title: "登陆平台",
      key: "platforms",
    },
    {
      title: "发售日期",
      key: "releaseDate",
    },
  ];
  if (tableType.value === "all") return res;
  else if (tableType.value === "notBought")
    return res.concat([
      {
        title: "优先等级",
        key: "priority",
      },
    ]);
  else
    return res.concat([
      {
        title: "购买日期",
        key: "boughtDate",
      },
      {
        title: "状态",
        key: "status",
      },
      {
        title: "通关日期",
        key: "clearDate",
      },
      {
        title: "评分",
        key: "rate",
      },
      {
        title: "备注",
        key: "comment",
      },
    ]);
});

/** 表格数据 */
const data = computed((): (Game | NotBoughtGame | BoughtGame)[] => {
  return [
    {
      id: 1,
      name: "xb",
      platforms: ["ns"],
    },
    {
      id: 2,
      name: "xb",
      platforms: ["ns", "wii"],
    },
    {
      id: 3,
      name: "xb",
      platforms: ["ns"],
    },
    {
      id: 4,
      name: "xb",
      platforms: ["ns"],
    },
    {
      id: 5,
      name: "xb",
      platforms: ["ns"],
    },
    {
      id: 6,
      name: "xb",
      platforms: ["ns"],
    },
    {
      id: 7,
      name: "xb",
      platforms: ["ns"],
    },
    {
      id: 8,
      name: "xb",
      platforms: ["ns"],
    },
    {
      id: 9,
      name: "xb",
      platforms: ["ns"],
    },
    {
      id: 10,
      name: "xb",
      platforms: ["ns"],
    },
    {
      id: 11,
      name: "xb",
      platforms: ["ns"],
    },
  ];
});

/** 行属性 */
const rowProps = (row: Game) => {
  return {
    style: "cursor:pointer",
    onClick: () => {
      console.log(row);
    },
  };
};

export default defineComponent({
  setup() {
    return {
      tableType,
      columns,
      data,
      rowProps,
    };
  },
});
</script>