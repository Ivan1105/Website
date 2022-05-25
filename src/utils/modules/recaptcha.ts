/**
 * 获取验证信息
 * @param action 请求标识
 * @returns 
 */
export function verifyCaptcha(action: string): Promise<string> {
    return new Promise((resolve, reject) => {
        window.grecaptcha.ready(() => {
            window.grecaptcha.execute("6Lfg6WYdAAAAAMk1y5z1RzEmtUzpvyX5LCUbMYJg", {
                action: action,
            }).then((token: string) => {
                resolve(token);
            }).catch((err: any) => {
                reject(err);
            })
        });
    })
}