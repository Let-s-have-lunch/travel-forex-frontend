import { z } from "zod";

export const tripSchema = z
    .object({
        title: z.string().min(1, "여행 제목을 입력해주세요."),
        startDate: z.string().min(1, "여행 시작일을 입력해주세요."),
        endDate: z.string().min(1, "여행 종료일을 입력해주세요."),
        budgetKrw: z.number().min(0, "예산은 0 이상이어야 합니다."),
    })
    .refine(
        data => {
            // 둘 다 입력되었을 때만 날짜 비교 (미입력 상태면 위의 min(1)에서 걸러짐)
            if (!data.startDate || !data.endDate) return true;

            const start = new Date(data.startDate);
            const end = new Date(data.endDate);
            return start <= end;
        },
        {
            message: "시작일은 종료일보다 이전이어야 합니다.",
            path: ["endDate"], // 에러를 발생시킬 필드 지정 (종료일 input 아래에 에러 표시)
        },
    );

export type TripInputType = z.infer<typeof tripSchema>;
