// Utilities
import { userTheme } from '@/utils/storage';
import { usePreferredColorScheme } from '@vueuse/core';
import { defineStore, storeToRefs } from 'pinia'
import { useTheme } from 'vuetify';
import { useUserStore } from './user';

export const useAppStore = defineStore('app', () => {
  const userStore = useUserStore();
  const { userData } = storeToRefs(userStore);

  interface Menu {
    title: string;
    /** 1-appbar 2-sidebar 3-all */
    mode: 1 | 2 | 3;
    show?: boolean;
    props: {
      to: string;
      prependIcon: string;
      rounded: string;
    }
  }

  /** 菜单信息 */
  const menus = computed(() => [
    {
      title: '首页',
      mode: 2,
      props: {
        to: '/',
        prependIcon: 'mdi-home',
        rounded: 'shaped'
      }
    },
    {
      title: '工具',
      mode: 3,
      props: {
        to: '/',//{ name: 'tool' },
        prependIcon: 'mdi-toolbox',
        rounded: 'shaped'
      }
    },
    {
      title: '登录',
      mode: 1,
      props: {
        to: '/',//{ name: 'tool' },
        prependIcon: 'mdi-toolbox',
        rounded: 'shaped'
      }
    },
    {
      title: '个人中心',
      mode: 2,
      show: !!userData.value,
      props: {
        to: '/',
        prependIcon: 'mdi-account',
        rounded: 'shaped'
      }
    },
    // {
    //   title: '后台管理',
    //   show: config.value && userData.value && (config.value.permissions.admin & userData.value.permission),
    //   props: {
    //     to: { name: 'admin' },
    //     prependIcon: mdiCog,
    //     rounded: 'shaped'
    //   }
    // }
  ].filter(({ show }) => show !== false)) as any as Menu[];

  /** 显示侧边栏 */
  const showSideBar = ref(false);

  // 控制主题的代码
  const theme = useTheme();
  const themeName = computed(() => theme.global.name.value);
  const osTheme = usePreferredColorScheme();
  watch(osTheme, (v) => {
    if (!['light', 'dark'].includes(v) || userTheme.value !== 'system') return;
    theme.global.name.value = v;

  });
  watch(userTheme, (v) => {
    if (!['light', 'dark', 'system'].includes(v)) return;
    if (v === 'system') theme.global.name.value = osTheme.value || 'light';
    else theme.global.name.value = v;
  }, {
    immediate: true
  });
  /** 切换主题 */
  const changeTheme = function (t: string) {
    userTheme.value = t;
  }

  return {
    changeTheme,
    menus,
    themeName,
    showSideBar
  }
});
