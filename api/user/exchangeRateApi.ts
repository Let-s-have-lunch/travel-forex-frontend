import api from "@/api/axiosInstance";
import { CurrencyCode, ExchangeRateSummary, RatePeriod } from "@/types/exchangeRate";

const getSummary = async (
    currencies: CurrencyCode[],
    period: RatePeriod = "ONE_DAY",
): Promise<ExchangeRateSummary[]> => {
    const response = await api.get("/exchange-rates/summary", {
        params: {
            currencies: currencies.join(","), // Spring의 List<CurrencyCode> 콤마 구분 바인딩과 맞춤
            period,
        },
    });
    return response.data.data;
};

export default {
    getSummary,
};
