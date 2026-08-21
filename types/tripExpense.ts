import { CurrencyCode } from "./trip";

export type ExpenseCategory = "FOOD" | "TRANSPORT" | "SHOPPING" | "OTHER";
export type PaymentMethod = "CASH" | "CARD" | "WALLET";

// 1. 서버 응답 DTO와 1:1 매칭되는 타입 (아까 누락된 필드 포함)
export interface TripExpense {
    id: number;
    currency: CurrencyCode;
    amount: number;
    convertedKrwAmount: number;
    category: ExpenseCategory;
    merchant?: string;
    paymentMethod: PaymentMethod;
    isWalletLinked: boolean;
    memo?: string;
    expenseDate: string;
}

// 2. 화면 하단 요약 리스트를 그리기 위한 프론트엔드 전용 타입
export interface TripExpenseSummary {
    category: ExpenseCategory;
    icon: string;
    label: string;
    amount: number;
    percentage: number;
    color: string;
}
