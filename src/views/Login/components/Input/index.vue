<template>
  <div class="input-item">
    <input
      :value="modelValue"
      :placeholder="placeholder"
      @input="handleInput"
      :type="type"
    />
    <div
      role="button"
      v-if="$slots.right"
      class="slot-right"
      @click="handleRightButtonClick"
    >
      <slot name="right"></slot>
    </div>
    <n-el
      tag="span"
      :class="{
        'validate-info': true,
        show: displayValidator,
      }"
    >
      {{ validator }}
    </n-el>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";

export default defineComponent({
  props: {
    placeholder: String,
    validator: {
      type: String,
      default: "",
    },
    modelValue: String,
    type: {
      type: String,
      default: "text",
    },
  },
  emits: ["update:modelValue", "rightButtonClick"],
  setup(props, context) {
    /** 是否显示验证器 */
    let displayValidator = ref(false);
    function handleInput(ev: any) {
      displayValidator.value = true;
      context.emit("update:modelValue", ev.target.value);
    }

    /** 右边按钮触发点击 */
    const handleRightButtonClick = function () {
      context.emit("rightButtonClick");
    };

    return {
      displayValidator,
      handleInput,
      handleRightButtonClick,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index";
</style>