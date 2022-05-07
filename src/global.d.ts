import { LoadingBarProviderInst } from 'naive-ui'

interface Window {
    loadingBar?: LoadingBarProviderInst
}

declare global {
    interface Window {
        loadingBar?: LoadingBarProviderInst
    }
}