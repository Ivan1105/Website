import { useStorage } from "@vueuse/core";

/** 用户主题 */
export const userTheme = useStorage('userTheme', 'system', sessionStorage);