import axios from "@/utils/axios";

const prefixUrl = '/system';

export type Permission = {
    p_id: number,
    p_code: string,
    p_name: string,
    p_value: number
};
export async function listPermissions(): Promise<Permission[]> {
    return await axios.get('/listPermissions', { prefixUrl });
}

export async function addPermission(data: Partial<Record<keyof Permission, string>>) {
    return await axios.post('/addPermission', data, { prefixUrl });
}