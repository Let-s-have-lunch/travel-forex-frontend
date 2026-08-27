export const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export const formatCurrency = (amount: number, currencyCode?: string) => {
    const formattedAmount = new Intl.NumberFormat("ko-KR").format(amount);

    if (!currencyCode) {
        return formattedAmount;
    }

    const symbols: Record<string, string> = {
        KRW: "₩",
        USD: "$",
        JPY: "¥",
        EUR: "€",
        GBP: "£",
        CNY: "¥",
    };
    const symbol = symbols[currencyCode] ?? "₩";
    return `${symbol} ${formattedAmount}`;
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} (${dayOfWeek})`;
};

export const formatDateRange = (start: string, end: string): string => {
    const endDate = new Date(end);
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][endDate.getDay()];
    return `${formatDate(start)} ~ ${String(endDate.getMonth() + 1).padStart(2, "0")}.${String(endDate.getDate()).padStart(2, "0")} (${dayOfWeek})`;
};
