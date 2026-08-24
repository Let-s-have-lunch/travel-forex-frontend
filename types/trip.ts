export const CurrencyCodeList = ["KRW", "USD", "JPY", "EUR", "GBP", "CNY"] as const;

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
