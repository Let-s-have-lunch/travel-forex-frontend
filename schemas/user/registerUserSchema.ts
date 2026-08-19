import { userSchema } from "@/schemas/user/userSchema";
import { z } from "zod";

export const registerUserSchema = userSchema
    .extend({
        password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
        confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),
    })
    .refine(data => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "비밀번호가 일치하지 않습니다.",
    });

export type RegisterUserInputType = z.infer<typeof registerUserSchema>;
