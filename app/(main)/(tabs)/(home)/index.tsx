import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import TextComponent from "@/components/common/text/TextComponent";
import Card from "@/components/common/card/Card";
import axiosInstance from "@/api/axiosInstance";

const CURRENCY_META: Record<
    string,
    { name: string; country: string; flagUrl: string; symbol: string; defaultRate: number }
> = {
    KRW: {
        name: "대한민국 원",
        country: "한국",
        flagUrl: "https://flagcdn.com/w160/kr.png",
        symbol: "₩",
        defaultRate: 1,
    },
    USD: {
        name: "미국 달러",
        country: "미국",
        flagUrl: "https://flagcdn.com/w160/us.png",
        symbol: "$",
        defaultRate: 1424,
    },
    JPY: {
        name: "일본 엔",
        country: "일본",
        flagUrl: "https://flagcdn.com/w160/jp.png",
        symbol: "¥",
        defaultRate: 9.13,
    },
    EUR: {
        name: "유로",
        country: "유럽",
        flagUrl: "https://flagcdn.com/w160/eu.png",
        symbol: "€",
        defaultRate: 1385,
    },
    CNY: {
        name: "중국 위안",
        country: "중국",
        flagUrl: "https://flagcdn.com/w160/cn.png",
        symbol: "¥",
        defaultRate: 195,
    },
    GBP: {
        name: "영국 파운드",
        country: "영국",
        flagUrl: "https://flagcdn.com/w160/gb.png",
        symbol: "£",
        defaultRate: 1780,
    },
};

export default function HomePage() {
    const router = useRouter();
    const [currencyList, setCurrencyList] = useState<any[]>([]);
    const [totalKRW, setTotalKRW] = useState(0);
    const [changeRate, setChangeRate] = useState(1.25);
    const [isLoading, setIsLoading] = useState(true);

    const fetchHomeData = async () => {
        try {
            const response = await axiosInstance.get("/wallets");
            const rawData = response.data;
            const wallets = Array.isArray(rawData) ? rawData : rawData?.data || [];

            let calculatedTotalKRW = 0;
            const formattedWallets = wallets.map((wallet: any) => {
                const meta = CURRENCY_META[wallet.currency] || {
                    name: wallet.currency,
                    country: "기타",
                    flagUrl: "",
                    symbol: wallet.currency,
                    defaultRate: 1,
                };

                const balanceNum = Number(wallet.balance ?? wallet.amount) || 0;
                const rate = Number(wallet.exchangeRate) || meta.defaultRate;

                const krwValue =
                    wallet.currency === "KRW"
                        ? balanceNum
                        : Math.round(balanceNum * (wallet.currency === "JPY" ? rate / 100 : rate));

                calculatedTotalKRW += krwValue;

                return {
                    id: wallet.id || wallet.walletId,
                    currency: wallet.currency,
                    name: meta.name,
                    country: meta.country,
                    amount: balanceNum,
                    krw: krwValue,
                    changeRate: wallet.changeRate ?? 0.42,
                    flagUrl: meta.flagUrl,
                    symbol: meta.symbol,
                };
            });

            setCurrencyList(formattedWallets);
            setTotalKRW(calculatedTotalKRW);
        } catch (error) {
            console.error("지갑 데이터 조회 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHomeData();
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
                {/* 1. 인사말 */}
                <View className="mb-6 mt-4">
                    <TextComponent className="text-xl font-bold text-text-primary mb-1">
                        안녕하세요, 여행자님 👋
                    </TextComponent>
                    <TextComponent className="text-sm text-text-secondary">
                        오늘도 즐거운 여행 되세요!
                    </TextComponent>
                </View>

                {/* 2. MY WALLET 카드 (클릭 시 거래내역 페이지로 이동) */}
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
                                className={`text-xs font-bold ${changeRate >= 0 ? "text-success" : "text-error"}`}>
                                {changeRate >= 0 ? "▲" : "▼"} {Math.abs(changeRate)}% (오늘)
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

                {/* 3. 보유 외화 리스트 */}
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
                                                {isPositive ? "▲" : "▼"} {Math.abs(item.changeRate)}
                                                %
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

            {/* 4. 플로팅 버튼 (거래 유형 선택 페이지로 이동) */}
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
