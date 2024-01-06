import type { interact_type, member_role, member_status, user_role, user_sex } from '../databases/enums';

export type RegisterType = {
    id?: number,
    address?: string,
    name?: string,
    phone?: string,
    birthday?: Date | string,
    email?: string,
    ssn?: string,
    sex?: user_sex,
    username?: string,
    password?: string,
    avatar?: string,
    role: user_role
}
