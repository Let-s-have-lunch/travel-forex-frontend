// 1. 상수 배열을 정의하고 export (Zod 스키마에서 쓸 용도)
export const CurrencyCodeList = ["KRW", "USD", "JPY", "EUR", "GBP", "CNY"] as const;

// 2. 위 배열에서 타입을 자동 추출 ("KRW" | "USD" | "JPY" | "EUR" | "GBP" | "CNY")
export type CurrencyCode = (typeof CurrencyCodeList)[number];

// 3. 기존 Trip 인터페이스에 추가
export interface Trip {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    budgetKrw: number;
    currency: CurrencyCode; // 👈 새로 만든 타입 적용!
}
