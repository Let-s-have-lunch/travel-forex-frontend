import { useEffect, useId, useState } from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import TextComponent from "@/components/common/text/TextComponent";
import Card from "@/components/common/card/Card";
import exchangeRateApi from "@/api/user/exchangeRateApi";
import { CurrencyCode, ExchangeRateSummary, RatePeriod } from "@/types/exchangeRate";

const CHART_WIDTH = 220;
const CHART_HEIGHT = 44;

const TARGET_CURRENCIES: CurrencyCode[] = ["USD", "JPY", "EUR", "GBP", "CNY"];

const CURRENCY_LABELS: Record<string, string> = {
    USD: "USD/KRW",
    JPY: "JPY/KRW",
    EUR: "EUR/KRW",
    GBP: "GBP/KRW",
    CNY: "CNY/KRW",
};

const PERIOD_OPTIONS: { label: string; value: RatePeriod }[] = [
    { label: "1D", value: "ONE_DAY" },
    { label: "1W", value: "ONE_WEEK" },
    { label: "1M", value: "ONE_MONTH" },
    { label: "3M", value: "THREE_MONTHS" },
    { label: "1Y", value: "ONE_YEAR" },
];

function buildPathFromHistory(history: { rate: number }[]) {
    if (history.length < 2) return "";

    const rates = history.map(h => h.rate);
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const range = max - min || 1;
    const stepX = CHART_WIDTH / (rates.length - 1);

    return rates
        .map((rate, i) => {
            const x = i * stepX;
            const y = CHART_HEIGHT - ((rate - min) / range) * CHART_HEIGHT;
            return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(" ");
}

function GradientExchangeChart({ pathD, color }: { pathD: string; color: string }) {
    const gradientId = useId().replace(/[:]/g, "");

    if (!pathD) {
        return <View style={{ height: CHART_HEIGHT }} />;
    }

    const fillPathD = `${pathD} L ${CHART_WIDTH} ${CHART_HEIGHT} L 0 ${CHART_HEIGHT} Z`;

    return (
        <View style={{ width: "100%", height: CHART_HEIGHT, marginTop: 4, alignItems: "flex-end" }}>
            <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                <Defs>
                    <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0%" stopColor={color} stopOpacity={0.28} />
                        <Stop offset="60%" stopColor={color} stopOpacity={0.08} />
                        <Stop offset="100%" stopColor={color} stopOpacity={0} />
                    </LinearGradient>
                </Defs>
                <Path d={fillPathD} fill={`url(#${gradientId})`} />
                <Path
                    d={pathD}
                    stroke={color}
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            </Svg>
        </View>
    );
}

export default function ForexPage() {
    const [period, setPeriod] = useState<RatePeriod>("ONE_DAY");
    const [summaries, setSummaries] = useState<ExchangeRateSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [lastUpdate, setLastUpdate] = useState("");

    const formatNow = () => {
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    };

    const fetchSummary = async (targetPeriod: RatePeriod) => {
        try {
            setIsError(false);
            const data = await exchangeRateApi.getSummary(TARGET_CURRENCIES, targetPeriod);
            setSummaries(data);
            setLastUpdate(formatNow());
        } catch (error) {
            console.error("환율 요약 조회 실패:", error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchSummary(period);

        const timer = setInterval(() => fetchSummary(period), 60000);
        return () => clearInterval(timer);
    }, [period]);

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <ActivityIndicator size="large" color="#6BC1B6" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
            <View className="px-4 pt-2">
                <Card className="bg-white rounded-[28px] px-4 py-5" shadow="sm">
                    {isError ? (
                        <View className="py-8 items-center">
                            <TextComponent className="text-text-tertiary text-sm">
                                환율 정보를 불러올 수 없습니다.
                            </TextComponent>
                        </View>
                    ) : (
                        summaries.map((item, idx) => {
                            const pathD = buildPathFromHistory(item.history);
                            const color = item.isUp ? "#00a36c" : "#ff4d4d";

                            return (
                                <View
                                    key={item.currencyCode}
                                    className={idx !== summaries.length - 1 ? "mb-5" : ""}>
                                    <View className="flex-row justify-between items-center">
                                        <TextComponent className="font-bold text-[13px] text-text-primary">
                                            {CURRENCY_LABELS[item.currencyCode] ??
                                                item.currencyCode}
                                        </TextComponent>
                                        <TextComponent
                                            className="text-xs font-bold"
                                            style={{ color }}>
                                            {item.isUp ? "▲" : "▼"} {item.changeRate.toFixed(2)}%
                                        </TextComponent>
                                    </View>

                                    <TextComponent className="text-[15px] font-extrabold text-text-primary mt-0.5">
                                        {item.currentRate.toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </TextComponent>

                                    <GradientExchangeChart pathD={pathD} color={color} />
                                </View>
                            );
                        })
                    )}

                    {/* 기간 선택 탭 (1D / 1W / 1M / 3M / 1Y) */}
                    <View className="flex-row bg-disabled/50 rounded-full p-1 mt-5">
                        {PERIOD_OPTIONS.map(option => {
                            const isActive = option.value === period;
                            return (
                                <TouchableOpacity
                                    key={option.value}
                                    onPress={() => setPeriod(option.value)}
                                    className={`flex-1 items-center py-2 rounded-full ${isActive ? "bg-white shadow-sm" : ""}`}>
                                    <TextComponent
                                        className={`text-xs ${isActive ? "font-bold text-text-primary" : "font-medium text-text-tertiary"}`}>
                                        {option.label}
                                    </TextComponent>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <TextComponent className="text-center text-[11px] text-text-tertiary mt-4">
                        기준 시간: {lastUpdate}
                    </TextComponent>
                </Card>
            </View>
        </SafeAreaView>
    );
}
