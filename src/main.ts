import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from '@/locales'

import '@/assets/global.scss'
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'

const app = createApp(App)
app.use(i18n)
app.use(router)
app.mount('#app')
