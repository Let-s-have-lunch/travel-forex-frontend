import { z } from "zod";

export const userSchema = z.object({
    email: z.string().min(1, "이메일을 입력해주세요.").email("올바른 이메일 형식을 입력해주세요."),

    nickname: z
        .string()
        .min(2, "닉네임은 2자 이상이어야 합니다.")
        .max(10, "닉네임은 10자 이하여야 합니다."),

    phoneNumber: z.string().min(1, "전화번호를 입력해주세요."),

    gender: z.enum(["MALE", "FEMALE"], {
        message: "성별을 선택해주세요.",
    }),

    birthdate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "생년월일은 YYYY-MM-DD 형식으로 입력해주세요."),
});
