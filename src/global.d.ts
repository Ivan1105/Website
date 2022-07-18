import { LoadingBarProviderInst } from 'naive-ui'
import { DialogApiInjection } from 'naive-ui/lib/dialog/src/DialogProvider';
import { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider';

declare global {
    interface Window {
        loadingBar?: LoadingBarProviderInst
        message?: MessageApiInjection;
        grecaptcha?: any;
        dialog?: DialogApiInjection;
    }
    interface UserInfo {
        uid: number | null;
        username: string | null;
        icon: string | null;
    }
}
