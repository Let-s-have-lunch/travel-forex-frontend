import api from "@/api/axiosInstance";
import { User } from "@/types/user";

/* ========================================
   회원가입
======================================== */

export interface CreateUserRequest {
    email: string;
    password: string;
    nickname: string;
    phoneNumber: string;
    gender: "MALE" | "FEMALE";
    birthdate: string;
}

export interface CreateUserResponse {
    message: string;
    data: User;
}

export const createUser = async (request: CreateUserRequest): Promise<CreateUserResponse> => {
    const response = await api.post<CreateUserResponse>("/users/create", request);

    return response.data;
};

/* ========================================
   로그인
======================================== */

export interface LoginUserRequest {
    email: string;
    password: string;
}

export interface LoginData {
    user: User;
    token: string;
}

export interface LoginUserResponse {
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export const loginUser = async (request: LoginUserRequest): Promise<LoginData> => {
    const response = await api.post<LoginUserResponse>("/users/login", request);

    return response.data.data;
};
