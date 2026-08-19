import api from "@/api/axiosInstance";

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
