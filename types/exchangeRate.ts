export type CurrencyCode = "KRW" | "USD" | "JPY" | "EUR" | "GBP" | "CNY";

export type RatePeriod = "ONE_DAY" | "ONE_WEEK" | "ONE_MONTH" | "THREE_MONTHS" | "ONE_YEAR";

export type RatePoint = {
    recordedAt: string;
    rate: number;
};

export type ExchangeRateSummary = {
    currencyCode: CurrencyCode;
    currentRate: number;
    changeRate: number;
    isUp: boolean;
    history: RatePoint[];
};
