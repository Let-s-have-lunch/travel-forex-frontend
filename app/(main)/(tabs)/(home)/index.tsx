import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import TextComponent from "@/components/common/text/TextComponent";
import Card from "@/components/common/card/Card";
import walletApi, { WalletItem } from "@/api/user/walletApi";
import exchangeRateApi from "@/api/user/exchangeRateApi";
import { CurrencyCode } from "@/types/trip";
import { ExchangeRateSummary } from "@/types/exchangeRate";

const CURRENCY_META: Record<
    string,
    { name: string; country: string; flagUrl: string; symbol: string }
> = {
    KRW: {
        name: "대한민국 원",
        country: "한국",
        flagUrl: "https://flagcdn.com/w160/kr.png",
        symbol: "₩",
    },
    USD: {
        name: "미국 달러",
        country: "미국",
        flagUrl: "https://flagcdn.com/w160/us.png",
        symbol: "$",
    },
    JPY: {
        name: "일본 엔",
        country: "일본",
        flagUrl: "https://flagcdn.com/w160/jp.png",
        symbol: "¥",
    },
    EUR: { name: "유로", country: "유럽", flagUrl: "https://flagcdn.com/w160/eu.png", symbol: "€" },
    CNY: {
        name: "중국 위안",
        country: "중국",
        flagUrl: "https://flagcdn.com/w160/cn.png",
        symbol: "¥",
    },
    GBP: {
        name: "영국 파운드",
        country: "영국",
        flagUrl: "https://flagcdn.com/w160/gb.png",
        symbol: "£",
    },
};

type CurrencyDisplayItem = {
    id: number;
    currency: CurrencyCode;
    name: string;
    country: string;
    amount: number;
    krw: number;
    changeRate: number; // 부호 있는 등락률(%) — 표시용
    flagUrl: string;
    symbol: string;
};

export default function HomePage() {
    const router = useRouter();
    const [currencyList, setCurrencyList] = useState<CurrencyDisplayItem[]>([]);
    const [totalKRW, setTotalKRW] = useState(0);
    const [totalChangeRate, setTotalChangeRate] = useState(0); // 부호 있는 총자산 등락률(%)
    const [isLoading, setIsLoading] = useState(true);

    const fetchHomeData = async () => {
        try {
            const wallets: WalletItem[] = await walletApi.getMyWallets();

            // KRW를 제외한 보유 통화 목록 (환율 API 조회 대상)
            const foreignCurrencies = Array.from(
                new Set(wallets.map(w => w.currency).filter(c => c !== "KRW")),
            ) as CurrencyCode[];

            let rateMap = new Map<string, ExchangeRateSummary>();

            if (foreignCurrencies.length > 0) {
                try {
                    const summaries = await exchangeRateApi.getSummary(
                        foreignCurrencies,
                        "ONE_DAY",
                    );
                    rateMap = new Map(summaries.map(s => [s.currencyCode, s]));
                } catch (rateError) {
                    console.error("환율 정보 조회 실패:", rateError);
                    // 환율 조회 실패 시에도 지갑 목록 자체는 보여주되, 등락률은 0으로 처리
                }
            }

            let totalCurrentKrw = 0;
            let totalPreviousKrw = 0;

            const formattedWallets: CurrencyDisplayItem[] = wallets.map(wallet => {
                const meta = CURRENCY_META[wallet.currency] || {
                    name: wallet.currency,
                    country: "기타",
                    flagUrl: "",
                    symbol: wallet.currency,
                };

                const balance = Number(wallet.balance) || 0;

                if (wallet.currency === "KRW") {
                    totalCurrentKrw += balance;
                    totalPreviousKrw += balance; // KRW는 환율 변동이 없음

                    return {
                        id: wallet.id,
                        currency: wallet.currency,
                        name: meta.name,
                        country: meta.country,
                        amount: balance,
                        krw: balance,
                        changeRate: 0,
                        flagUrl: meta.flagUrl,
                        symbol: meta.symbol,
                    };
                }

                const summary = rateMap.get(wallet.currency);
                const currentRate = summary?.currentRate ?? 0;
                const changePct = summary?.changeRate ?? 0; // 절대값(%)
                const isUp = summary?.isUp ?? true;
                const signedChangePct = isUp ? changePct : -changePct;

                const currentKrw = Math.round(balance * currentRate);

                // 등락률로부터 "어제 시점" 환율을 역산: previousRate = currentRate / (1 + pct/100)
                const previousRate =
                    currentRate > 0 && 1 + signedChangePct / 100 !== 0
                        ? currentRate / (1 + signedChangePct / 100)
                        : currentRate;
                const previousKrw = Math.round(balance * previousRate);

                totalCurrentKrw += currentKrw;
                totalPreviousKrw += previousKrw;

                return {
                    id: wallet.id,
                    currency: wallet.currency,
                    name: meta.name,
                    country: meta.country,
                    amount: balance,
                    krw: currentKrw,
                    changeRate: signedChangePct,
                    flagUrl: meta.flagUrl,
                    symbol: meta.symbol,
                };
            });

            const overallChangeRate =
                totalPreviousKrw > 0
                    ? ((totalCurrentKrw - totalPreviousKrw) / totalPreviousKrw) * 100
                    : 0;

            setCurrencyList(formattedWallets);
            setTotalKRW(totalCurrentKrw);
            setTotalChangeRate(overallChangeRate);
        } catch (error) {
            console.error("지갑 데이터 조회 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHomeData().then(() => {});
    }, []);

    const formatNumber = (num: number) => {
        return num?.toLocaleString("ko-KR") || "0";
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <ActivityIndicator size="large" color="#6BC1B6" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
            <StatusBar style="dark" />

            <ScrollView
                className="flex-1 px-6"
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
                showsVerticalScrollIndicator={false}>
                <View className="mb-6 mt-4">
                    <TextComponent className="text-xl font-bold text-text-primary mb-1">
                        안녕하세요, 여행자님 👋
                    </TextComponent>
                    <TextComponent className="text-sm text-text-secondary">
                        오늘도 즐거운 여행 되세요!
                    </TextComponent>
                </View>

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => router.push("/(main)/(tabs)/(home)/history" as any)}>
                    <Card
                        className="bg-primary-sub flex-row justify-between items-center relative overflow-hidden"
                        shadow="md">
                        <View className="z-10">
                            <TextComponent className="text-sm font-bold text-text-primary mb-2">
                                MY WALLET
                            </TextComponent>
                            <TextComponent className="text-xs text-text-secondary mb-1">
                                총 자산 (원화 환산)
                            </TextComponent>
                            <TextComponent className="text-3xl font-extrabold text-text-primary mb-2">
                                ₩ {formatNumber(totalKRW)}
                            </TextComponent>
                            <TextComponent
                                className={`text-xs font-bold ${totalChangeRate >= 0 ? "text-success" : "text-error"}`}>
                                {totalChangeRate >= 0 ? "▲" : "▼"}{" "}
                                {Math.abs(totalChangeRate).toFixed(2)}% (오늘)
                            </TextComponent>
                        </View>

                        <Image
                            source={require("@/assets/images/wallet_illust.png")}
                            style={{
                                width: 110,
                                height: 110,
                                position: "absolute",
                                right: 10,
                                bottom: 0,
                            }}
                            resizeMode="contain"
                        />
                    </Card>
                </TouchableOpacity>

                <View className="mb-4 mt-6 flex-row justify-between items-center">
                    <TextComponent className="text-lg font-bold text-text-primary">
                        보유 외화
                    </TextComponent>
                </View>

                <View className="space-y-1">
                    {currencyList.length === 0 ? (
                        <View className="py-8 items-center">
                            <TextComponent className="text-text-tertiary">
                                보유 중인 외화 지갑이 없습니다.
                            </TextComponent>
                        </View>
                    ) : (
                        currencyList.map((item, index) => {
                            const isPositive = item.changeRate >= 0;
                            const isLast = index === currencyList.length - 1;

                            return (
                                <View
                                    key={item.id}
                                    className={`flex-row items-center justify-between py-4 ${!isLast ? "border-b border-divider/40" : ""}`}>
                                    <View className="flex-row items-center">
                                        <View className="w-11 h-11 rounded-full overflow-hidden border border-divider/50 mr-3.5 bg-gray-100 shadow-sm items-center justify-center">
                                            {item.flagUrl ? (
                                                <Image
                                                    source={{ uri: item.flagUrl }}
                                                    className="w-full h-full"
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <TextComponent className="text-base">
                                                    🌐
                                                </TextComponent>
                                            )}
                                        </View>
                                        <View>
                                            <View className="flex-row items-center gap-1.5 mb-0.5">
                                                <TextComponent className="text-base font-bold text-text-primary">
                                                    {item.currency}
                                                </TextComponent>
                                                <View className="bg-disabled/60 px-1.5 py-0.5 rounded">
                                                    <TextComponent className="text-[10px] font-medium text-text-secondary">
                                                        {item.country}
                                                    </TextComponent>
                                                </View>
                                            </View>
                                            <TextComponent className="text-xs text-text-secondary">
                                                {item.name}
                                            </TextComponent>
                                        </View>
                                    </View>

                                    <View className="items-end">
                                        <View className="flex-row items-center mb-1">
                                            <TextComponent className="text-base font-bold text-text-primary mr-2">
                                                {item.symbol} {formatNumber(item.amount)}
                                            </TextComponent>
                                            <TextComponent
                                                className={`text-xs font-bold ${isPositive ? "text-success" : "text-error"}`}>
                                                {isPositive ? "▲" : "▼"}{" "}
                                                {Math.abs(item.changeRate).toFixed(2)}%
                                            </TextComponent>
                                        </View>
                                        <TextComponent className="text-xs text-text-tertiary">
                                            ≈ ₩ {formatNumber(item.krw)}
                                        </TextComponent>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>

            <View className="absolute bottom-6 right-6">
                <TouchableOpacity
                    className="w-14 h-14 bg-primary-main rounded-full items-center justify-center shadow-lg"
                    activeOpacity={0.8}
                    onPress={() => router.push("/(main)/(tabs)/(home)/select-type" as any)}>
                    <TextComponent
                        className="text-white text-3xl font-light"
                        style={{ lineHeight: 36, marginTop: -2 }}>
                        +
                    </TextComponent>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
