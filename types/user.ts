export const Gender = {
    MALE: "MALE",
    FEMALE: "FEMALE",
} as const;

export type GenderType = (typeof Gender)[keyof typeof Gender];

export const Role = {
    USER: "USER",
    ADMIN: "ADMIN",
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

export interface User {
    id: number;
    email: string;
    nickname: string;
    phoneNumber: string;
    gender: GenderType;
    birthdate: string;
    role: RoleType;
}
