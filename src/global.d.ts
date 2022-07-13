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
    declare interface UserInfo {
        uid: number;
        username: string | null;
        icon: string | null;
    }
}
