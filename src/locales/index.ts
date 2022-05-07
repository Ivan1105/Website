import { createI18n } from "vue-i18n"

const getDefaultLanguage = function () {
    const lang = navigator.language;
    return lang.substring(0, 2);
}

const DEFAULT_LANG = getDefaultLanguage()
const LOCALE_KEY = 'localeLanguage'

const locales = {
    zh: require('./zh.json'),
    en: require('./en.json')
}

const i18n = createI18n({
    locale: DEFAULT_LANG,
    fallbackLocale: 'zh',
    messages: locales
})

interface languageList {
    label: string,
    key: keyof typeof locales
}

/** 获取支持的语言列表 */
export const listLanguages = () => {
    const res: languageList[] = [];
    Object.entries(locales).forEach(([k, v]) => {
        res.push({ label: v.name, key: k as keyof typeof locales })
    })
    return res;
}

export const setLanguage = (lang = '') => {
    if (lang === '') {
        lang = window.localStorage.getItem(LOCALE_KEY) || DEFAULT_LANG
        if (!(Object as any).hasOwn(locales, lang))
            lang = DEFAULT_LANG
    }
    window.localStorage.setItem(LOCALE_KEY, lang)

    document.querySelector('html')?.setAttribute('lang', lang);
    i18n.global.locale = lang
}

setLanguage()
export default i18n
