export function matchRule(rule: keyof typeof rules, str: string) {
    return str.match(rules[rule]) !== null;
}

export const rules = {
    username: /^[A-Za-z0-9]{4,20}$/,
    password: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/,
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
}