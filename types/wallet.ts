export type TransactionType = "DEPOSIT" | "WITHDRAW";

export type PeriodType = "ALL" | "1M" | "3M" | "6M" | "1Y";

export interface TransactionItem {
    id: number;
    type: TransactionType;
    currency: string;
    amount: number;
    krwAmount: number;
    bankName: string;
    createdAt: string;
}

export interface PeriodOption {
    label: string;
    value: PeriodType;
    months?: number;
}
