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

/* ========================================
   내 정보 조회
======================================== */

export interface GetMeResponse {
    message: string;
    data: User;
}

export const getMe = async (): Promise<GetMeResponse> => {
    const response = await api.get<GetMeResponse>("/users/me");

    return response.data;
};

/* ========================================
   회원정보 수정
======================================== */

export interface UpdateUserRequest {
    nickname: string;
    phoneNumber: string;
    gender: "MALE" | "FEMALE";
    birthdate: string;
}

export interface UpdateUserResponse {
    message: string;
    data: User;
}

export const updateUser = async (request: UpdateUserRequest): Promise<UpdateUserResponse> => {
    const response = await api.patch<UpdateUserResponse>("/users/update", request);

    return response.data;
};

/* ========================================
   비밀번호 변경
======================================== */

export interface UpdatePasswordRequest {
    prevPassword: string;
    password: string;
    confirmPassword: string;
}

export interface UpdatePasswordResponse {
    message: string;
}

export const updatePassword = async (
    request: UpdatePasswordRequest,
): Promise<UpdatePasswordResponse> => {
    const response = await api.patch<UpdatePasswordResponse>("/users/password", request);

    return response.data;
};

/* ========================================
   회원 탈퇴
======================================== */
export interface WithdrawUserRequest {
    password: string;
}

export interface WithdrawUserResponse {
    message: string;
}

export const withdrawUser = async (data: WithdrawUserRequest): Promise<WithdrawUserResponse> => {
    const response = await api.patch("/users/withdraw", data);
    return response.data;
};