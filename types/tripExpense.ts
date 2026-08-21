import { CurrencyCode } from "./trip";

// 🌟 1. Zod와 함께 쓸 수 있도록 상수 배열로 선언
export const ExpenseCategoryList = ["FOOD", "TRANSPORT", "SHOPPING", "OTHER"] as const;
export const PaymentMethodList = ["CASH", "CARD", "WALLET"] as const;

// 🌟 2. 배열에서 TypeScript 타입을 자동으로 뽑아내기 (이전과 동일한 타입이 됨!)
export type ExpenseCategory = (typeof ExpenseCategoryList)[number];
export type PaymentMethod = (typeof PaymentMethodList)[number];

// 서버 응답 DTO와 1:1 매칭되는 타입
export interface TripExpense {
    id: number;
    currency: CurrencyCode;
    amount: number;
    convertedKrwAmount: number;
    category: ExpenseCategory;
    merchant?: string;
    paymentMethod: PaymentMethod;
    isWalletLinked: boolean;
    walletId?: number | null;
    memo?: string;
    expenseDate: string;
}

// 화면 하단 요약 리스트를 그리기 위한 프론트엔드 전용 타입
export interface TripExpenseSummary {
    category: ExpenseCategory;
    icon: string;
    label: string;
    amount: number;
    percentage: number;
    color: string;
}
