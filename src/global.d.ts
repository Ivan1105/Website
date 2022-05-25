import { LoadingBarProviderInst } from 'naive-ui'
import { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider';

// interface Window {
//     loadingBar?: LoadingBarProviderInst;
//     message?: MessageApiInjection;
// }

declare global {
    interface Window {
        loadingBar?: LoadingBarProviderInst
        message?: MessageApiInjection;
        grecaptcha?: any;
    }
}