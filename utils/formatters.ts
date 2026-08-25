export const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount);
};
