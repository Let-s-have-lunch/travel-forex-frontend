import { z } from "zod";
import { CurrencyCodeList } from "@/types/trip";
import { ExpenseCategoryList, PaymentMethodList } from "@/types/tripExpense";

export const tripExpenseSchema = z
    .object({
        currency: z.enum(CurrencyCodeList, {
            message: "통화 코드를 선택해주세요.",
        }),
        amount: z.number().min(0.01, "금액은 0보다 커야 합니다."),
        convertedKrwAmount: z.number().min(0, "원화 환산 금액을 확인해주세요."),
        category: z.enum(ExpenseCategoryList, {
            message: "지출 카테고리를 선택해주세요.",
        }),
        merchant: z.string().optional(),
        paymentMethod: z.enum(PaymentMethodList, {
            message: "결제 수단을 선택해주세요.",
        }),
        isWalletLinked: z.boolean(), // 에러 나던 부분 싹 날리고 심플하게!
        walletId: z.number().nullable().optional(),
        memo: z.string().optional(),
        expenseDate: z.string().min(1, "지출 일시를 입력해주세요."),
    })
    .refine(
        data => {
            // 결제 수단이 WALLET이거나 지갑 연동이 켜져 있는데 지갑 ID가 없는 경우 방어
            if (data.isWalletLinked && !data.walletId) {
                return false;
            }
            return true;
        },
        {
            message: "지갑 연동 시 결제할 지갑을 선택해주세요.",
            path: ["walletId"],
        },
    );

export type TripExpenseInputType = z.infer<typeof tripExpenseSchema>;
