import api from "@/api/axiosInstance";

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

export interface UserResponse {
    id: number;
    email: string;
    nickname: string;
    phoneNumber: string;
    gender: "MALE" | "FEMALE";
    birthdate: string;
    role: string;
}

export interface CreateUserResponse {
    message: string;
    data: UserResponse;
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

export interface LoginUserResponse {
    message: string;
    data: {
        user: UserResponse;
        token: string;
    };
}

export const loginUser = async (request: LoginUserRequest): Promise<LoginUserResponse> => {
    const response = await api.post<LoginUserResponse>("/users/login", request);

    return response.data;
};
