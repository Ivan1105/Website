<template>
  <div class="header">
    <n-h1 prefix="bar">Deemo练习记录</n-h1>
    <n-p depth="3">
      此工具用于《Deemo》的练习记录，日后将会完善功能和优化界面
    </n-p>
  </div>
  <n-data-table :columns="columns" :data="data" :single-line="false" />
</template>

<script lang="ts">
import {
  defineComponent,
  h,
  nextTick,
  onMounted,
  Ref,
  ref,
  watch,
} from "@vue/runtime-core";
import { DataTableColumns, NInput, NSwitch } from "naive-ui";
import axios from "@/utils/modules/axios";

/** 每条数据的基本类型 */
type Course = {
  /** 编号 */
  id: number;
  /** 段位 */
  dan: string;
  /** 曲目 */
  song: string;
  /** 难度 */
  level: string;
  /** 是否FC */
  fc: boolean;
  /** charming数量 */
  charming: number;
  /** 总note数 */
  total: number;
  /** 非charming上限 */
  max: number;
  /** 备注 */
  extra: number;
  /** 最后记录时间 */
  time: string | null;
};

/** 可编辑表格单元组件 */
const ShowOrEdit = defineComponent({
  props: {
    value: [String, Number],
  },
  emits: {
    updateValue: (v: number | string) => true,
  },
  setup(props, context) {
    const isEdit = ref(false);
    const inputRef: Ref<null | typeof NInput> = ref(null);
    const inputValue = ref(props.value);

    function handleOnClick() {
      isEdit.value = true;
      nextTick(() => {
        inputRef.value?.select();
      });
    }

    function handleChange() {
      if (inputValue.value === "") inputValue.value = "0";
      if (inputValue.value) context.emit("updateValue", inputValue.value);
      isEdit.value = false;
    }

    return () =>
      h(
        "div",
        {
          onClick: handleOnClick,
        },
        isEdit.value
          ? h(NInput, {
              ref: inputRef,
              defaultValue: String(inputValue.value),
              onUpdateValue: (v: string) => {
                inputValue.value = v;
              },
              onChange: handleChange,
              onBlur: handleChange,
            })
          : props.value
      );
  },
});

type Score = {
  /** fc数量 */
  fc: number;
  /** 非charming数量 */
  nonCharming: number;
  /** 是否通过 */
  completed: boolean;
  /** 最后一次记录时间 */
  time?: number;
};

/** 每段曲目的成绩 */
const score: Ref<Map<string, Score>> = ref(new Map());

const columns: DataTableColumns<Course> = [
  {
    title: "段位",
    key: "dan",
    rowSpan: () => 4,
    render: (row) => {
      const tmp = score.value.get(row.dan);
      if (tmp?.completed) return `${row.dan} (已完成)`;
      else return row.dan;
    },
  },
  {
    title: "曲目",
    key: "song",
  },
  {
    title: "难度",
    key: "level",
  },
  {
    title: "是否FC",
    key: "FC",
    render: (row) => {
      return h(NSwitch, {
        defaultValue: Boolean(row.fc),
        onUpdateValue: (v: boolean) => {
          row.fc = v;
          axios
            .post("/deemo/setNewFC", { id: row.id, fc: row.fc })
            .then((res) => {
              if (res.data.code !== 200) return Promise.reject();
            })
            .catch(() => {
              row.fc = !row.fc;
            });
        },
      });
    },
  },
  {
    title: "Charming数量",
    key: "charming",
    render: (row) => {
      return h(ShowOrEdit, {
        value: row.charming,
        onUpdateValue: (v) => {
          row.charming = Number(v);
          axios
            .post("/deemo/setNewCharming", {
              id: row.id,
              charming: row.charming,
            })
            .then((res) => {
              if (res.data.code !== 200) return Promise.reject();
            })
            .catch(() => {
              row.charming = 0;
            });
        },
      });
    },
  },
  {
    title: "Note总数",
    key: "total",
    render: (row) => {
      return h(ShowOrEdit, {
        value: row.total,
        onUpdateValue: (v) => {
          row.total = Number(v);
          axios
            .post("/deemo/setNewTotal", {
              id: row.id,
              total: row.total,
            })
            .then((res) => {
              if (res.data.code !== 200) return Promise.reject();
            })
            .catch(() => {
              row.total = 0;
            });
        },
      });
    },
  },
  {
    title: "最大失误数量",
    key: "max",
    rowSpan: () => 4,
    render: (row) => {
      const tmp = score.value.get(row.dan);
      if (tmp && tmp.nonCharming <= row.max)
        return `${tmp.nonCharming}/${row.max} (已完成)`;
      else if (tmp) return `${tmp.nonCharming}/${row.max}`;
      else return `null - ${row.max}`;
    },
  },
  {
    title: "FC要求",
    key: "extra",
    rowSpan: () => 4,
    render: (row) => {
      const tmp = score.value.get(row.dan);
      if (tmp && tmp.fc >= row.extra) return `${tmp.fc}/${row.extra} (已完成)`;
      else if (tmp) return `${tmp.fc}/${row.extra}`;
      else return `null - ${row.extra}`;
    },
  },
  {
    title: "更新日期",
    key: "time",
    rowSpan: () => 4,
    render: (row) => {
      const tmp = score.value.get(row.dan);
      if (tmp?.time)
        return (new Date(tmp.time) as any).toLocaleString("zh", { hourCycle: "h23" });
      else return "-";
    },
  },
];

export default defineComponent({
  setup() {
    const data: Ref<Course[]> = ref([]);
    watch(
      data,
      () => {
        score.value.clear();

        data.value.forEach((v) => {
          if (!score.value.has(v.dan))
            score.value.set(v.dan, {
              fc: 0,
              nonCharming: 0,
              completed: false,
            });
          const tmp = score.value.get(v.dan)!;
          if (v.fc) tmp.fc++;
          if (v.fc) tmp.nonCharming += v.total - v.charming;
          else tmp.nonCharming += (v.total - v.charming) * 2;
          if (v.time) {
            if (tmp.time)
              tmp.time = Math.max(tmp.time, new Date(v.time).getTime());
            else tmp.time = new Date(v.time).getTime();
          }
          if (tmp.fc >= v.extra && tmp.nonCharming <= v.max)
            tmp.completed = true;
          score.value.set(v.dan, tmp);
        });
      },
      { deep: true }
    );

    onMounted(() => {
      axios.get("/deemo/showAllInfo").then((res) => {
        if (res.data.code !== 200) return Promise.reject();
        data.value = res.data.data;
      });
    });

    return {
      columns,
      data,
    };
  },
});
</script>

<style scoped>
.header {
  padding-left: 2em;
  padding-top: 1em;
  padding-bottom: 1em;
}
</style>