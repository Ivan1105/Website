<template>
  <div class="input-item">
    <input
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      @input="handleInput"
    />
    <button v-if="$slots.right" class="slot-right">
      <slot name="right"></slot>
    </button>
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
  },
  emits: ["update:modelValue"],
  setup(props, context) {
    /** 是否显示验证器 */
    let displayValidator = ref(false);
    function handleInput(ev: any) {
      displayValidator.value = true;
      context.emit("update:modelValue", ev.target.value);
    }

    return {
      displayValidator,
      handleInput,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./index";
</style>