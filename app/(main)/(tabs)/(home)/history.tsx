import React, { useEffect, useState, useCallback } from "react";
import { View, ScrollView, TouchableOpacity, Image, Modal, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import TextComponent from "@/components/common/text/TextComponent";
import axiosInstance from "@/api/axiosInstance";
import { TransactionItem, PeriodType, PeriodOption } from "@/types/wallet";

// 국가별 메타데이터
const CURRENCY_META: Record<string, { flagUrl: string; symbol: string; defaultRate: number }> = {
    KRW: { flagUrl: "https://flagcdn.com/w160/kr.png", symbol: "₩", defaultRate: 1 },
    USD: { flagUrl: "https://flagcdn.com/w160/us.png", symbol: "$", defaultRate: 1424 },
    JPY: { flagUrl: "https://flagcdn.com/w160/jp.png", symbol: "¥", defaultRate: 9.13 },
    EUR: { flagUrl: "https://flagcdn.com/w160/eu.png", symbol: "€", defaultRate: 1385 },
    CNY: { flagUrl: "https://flagcdn.com/w160/cn.png", symbol: "¥", defaultRate: 195 },
    GBP: { flagUrl: "https://flagcdn.com/w160/gb.png", symbol: "£", defaultRate: 1780 },
};

const PERIOD_OPTIONS: PeriodOption[] = [
    { label: "전체 내역", value: "ALL" },
    { label: "최근 1개월", value: "1M", months: 1 },
    { label: "3개월", value: "3M", months: 3 },
    { label: "6개월", value: "6M", months: 6 },
    { label: "1년", value: "1Y", months: 12 },
];

export default function HistoryPage() {
    const router = useRouter();
    const { walletId, currency } = useLocalSearchParams<{ walletId?: string; currency?: string }>();

    const [selectedTab, setSelectedTab] = useState<"DEPOSIT" | "WITHDRAW">("DEPOSIT");
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("ALL");
    const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);

    const [transactions, setTransactions] = useState<TransactionItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 거래내역 조회 API
    const fetchTransactions = useCallback(async () => {
        try {
            setIsLoading(true);

            if (walletId) {
                const response = await axiosInstance.get(`/wallets/${walletId}/transactions`);
                const pageData = response.data?.data;
                const rawList: any[] = Array.isArray(pageData)
                    ? pageData
                    : pageData?.content ||
                      pageData?.items ||
                      pageData?.list ||
                      pageData?.data ||
                      [];

                const formatted = rawList.map(tx => parseTransactionItem(tx, currency || "USD"));
                setTransactions(formatted);
            } else {
                const walletRes = await axiosInstance.get("/wallets");
                const rawData = walletRes.data;
                const wallets = Array.isArray(rawData) ? rawData : rawData?.data || [];

                const txPromises = wallets.map(async (w: any) => {
                    try {
                        const targetId = w.id || w.walletId;
                        const res = await axiosInstance.get(`/wallets/${targetId}/transactions`);
                        const pageData = res.data?.data;
                        const rawList: any[] = Array.isArray(pageData)
                            ? pageData
                            : pageData?.content ||
                              pageData?.items ||
                              pageData?.list ||
                              pageData?.data ||
                              [];

                        return rawList.map(tx => parseTransactionItem(tx, w.currency));
                    } catch {
                        return [];
                    }
                });

                const allResults = await Promise.all(txPromises);
                const merged = allResults.flat();
                merged.sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                );
                setTransactions(merged);
            }
        } catch (error) {
            console.error("거래내역 불러오기 실패:", error);
        } finally {
            setIsLoading(false);
        }
    }, [walletId, currency]);

    const parseTransactionItem = (tx: any, defaultCurrency: string): TransactionItem => {
        const rawType = String(tx.transactionType || tx.type || "").toUpperCase();
        const normalizedType: "DEPOSIT" | "WITHDRAW" =
            rawType === "WITHDRAWAL" || rawType === "WITHDRAW" ? "WITHDRAW" : "DEPOSIT";

        const currencyCode = tx.currency || defaultCurrency || "USD";
        const meta = CURRENCY_META[currencyCode] || { defaultRate: 1 };
        const numAmount = Number(tx.amount) || 0;

        const calculatedKrw =
            tx.convertedKrwAmount ??
            tx.krwAmount ??
            (currencyCode === "KRW"
                ? numAmount
                : Math.round(
                      numAmount *
                          (currencyCode === "JPY" ? meta.defaultRate / 100 : meta.defaultRate),
                  ));

        return {
            id: tx.id || tx.transactionId || Math.random(),
            type: normalizedType,
            currency: currencyCode,
            amount: numAmount,
            krwAmount: Number(calculatedKrw) || 0,
            bankName: tx.transactionMethod || tx.bankName || "은행 계좌",
            createdAt: tx.transactionDate || tx.createdAt || new Date().toISOString(),
        };
    };

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const formatNumber = (num: number) => {
        return num?.toLocaleString("ko-KR") || "0";
    };

    const formatDate = (isoString: string) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        const days = ["일", "월", "화", "수", "목", "금", "토"];
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}.${month}.${day} (${days[date.getDay()]})`;
    };

    const formatTime = (isoString: string) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    // 입금/출금 탭 및 선택 기간 필터링
    const filteredList = transactions.filter(item => {
        const matchesTab = item.type === selectedTab;
        if (!matchesTab) return false;

        if (selectedPeriod === "ALL") return true;

        const selectedOption = PERIOD_OPTIONS.find(p => p.value === selectedPeriod);
        if (!selectedOption?.months) return true;

        const txDate = new Date(item.createdAt).getTime();
        const now = new Date();
        const cutoffDate = new Date(
            now.getFullYear(),
            now.getMonth() - selectedOption.months,
            now.getDate(),
        ).getTime();

        return txDate >= cutoffDate;
    });

    // 날짜별 그룹화
    const groupedTransactions = filteredList.reduce<Record<string, TransactionItem[]>>(
        (acc, item) => {
            const dateKey = formatDate(item.createdAt);
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(item);
            return acc;
        },
        {},
    );

    const currentPeriodLabel =
        PERIOD_OPTIONS.find(p => p.value === selectedPeriod)?.label || "전체 내역";

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

            <View className="px-6 flex-1 max-w-[600px] w-full self-center">
                {/* 상단 네비게이션 헤더 */}
                <View className="relative py-4 items-center justify-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute left-0 w-10 h-10 items-start justify-center">
                        <TextComponent className="text-2xl font-bold text-text-primary">
                            ‹
                        </TextComponent>
                    </TouchableOpacity>
                    <TextComponent className="text-lg font-bold text-text-primary">
                        거래내역
                    </TextComponent>
                </View>

                {/* 1. 입금 / 출금 토글 탭 */}
                <View className="flex-row bg-[#EBEFEF] p-1 rounded-2xl mb-4">
                    <TouchableOpacity
                        className={`flex-1 py-2.5 rounded-xl items-center justify-center ${
                            selectedTab === "DEPOSIT" ? "bg-primary-main" : ""
                        }`}
                        onPress={() => setSelectedTab("DEPOSIT")}>
                        <TextComponent
                            className={`text-sm font-bold ${
                                selectedTab === "DEPOSIT" ? "text-white" : "text-text-secondary"
                            }`}>
                            입금
                        </TextComponent>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`flex-1 py-2.5 rounded-xl items-center justify-center ${
                            selectedTab === "WITHDRAW" ? "bg-primary-main" : ""
                        }`}
                        onPress={() => setSelectedTab("WITHDRAW")}>
                        <TextComponent
                            className={`text-sm font-bold ${
                                selectedTab === "WITHDRAW" ? "text-white" : "text-text-secondary"
                            }`}>
                            출금
                        </TextComponent>
                    </TouchableOpacity>
                </View>

                {/* 2. 기간 선택 필터 바 */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setIsPeriodModalOpen(true)}
                    className="flex-row justify-between items-center bg-card border border-border px-4 py-3.5 rounded-2xl mb-6">
                    <TextComponent className="text-sm font-bold text-text-primary">
                        {currentPeriodLabel}
                    </TextComponent>
                    <View className="flex-row items-center gap-1.5">
                        <TextComponent className="text-xs text-text-secondary">📅</TextComponent>
                        <TextComponent className="text-[10px] text-text-tertiary">▼</TextComponent>
                    </View>
                </TouchableOpacity>

                {/* 3. 거래 내역 리스트 */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}>
                    {Object.keys(groupedTransactions).length === 0 ? (
                        <View className="py-20 items-center">
                            <TextComponent className="text-sm text-text-tertiary">
                                {currentPeriodLabel} {selectedTab === "DEPOSIT" ? "입금" : "출금"}{" "}
                                내역이 존재하지 않습니다.
                            </TextComponent>
                        </View>
                    ) : (
                        Object.entries(groupedTransactions).map(([date, items]) => (
                            <View key={date} className="mb-6">
                                <TextComponent className="text-sm font-bold text-text-primary mb-3">
                                    {date}
                                </TextComponent>

                                <View className="space-y-3">
                                    {items.map(item => {
                                        const meta = CURRENCY_META[item.currency] || {
                                            flagUrl: "",
                                            symbol: item.currency,
                                        };
                                        const typeText = item.type === "DEPOSIT" ? "입금" : "출금";

                                        return (
                                            <View
                                                key={item.id}
                                                className="flex-row justify-between items-center py-2.5">
                                                {/* 좌측: 국기 + 정보 */}
                                                <View className="flex-row items-center">
                                                    <View className="w-10 h-10 rounded-full overflow-hidden border border-border mr-3 bg-gray-100 items-center justify-center">
                                                        {meta.flagUrl ? (
                                                            <Image
                                                                source={{ uri: meta.flagUrl }}
                                                                className="w-full h-full"
                                                                resizeMode="cover"
                                                            />
                                                        ) : (
                                                            <TextComponent className="text-sm">
                                                                🌐
                                                            </TextComponent>
                                                        )}
                                                    </View>
                                                    <View>
                                                        <TextComponent className="text-sm font-bold text-text-primary mb-0.5">
                                                            {item.currency} {typeText}
                                                        </TextComponent>
                                                        <TextComponent className="text-xs text-text-secondary">
                                                            {formatTime(item.createdAt)} |{" "}
                                                            {item.bankName}
                                                        </TextComponent>
                                                    </View>
                                                </View>

                                                {/* 우측: 금액 및 원화 환산액 */}
                                                <View className="items-end">
                                                    <TextComponent className="text-sm font-bold text-text-primary mb-0.5">
                                                        {meta.symbol} {formatNumber(item.amount)}
                                                    </TextComponent>
                                                    <TextComponent className="text-xs text-text-tertiary">
                                                        ≈ ₩ {formatNumber(item.krwAmount)}
                                                    </TextComponent>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            </View>

            {/* 웹/모바일 겸용 중앙 팝업 다이얼로그 모달 */}
            <Modal visible={isPeriodModalOpen} transparent animationType="fade">
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setIsPeriodModalOpen(false)}
                    className="flex-1 justify-center items-center bg-black/40 px-6">
                    <View
                        className="bg-card w-full max-w-[340px] rounded-3xl p-5 border border-border"
                        onStartShouldSetResponder={() => true}>
                        <TextComponent className="text-base font-bold text-text-primary mb-4 text-center">
                            조회 기간 선택
                        </TextComponent>

                        <View className="space-y-2">
                            {PERIOD_OPTIONS.map(item => {
                                const isSelected = selectedPeriod === item.value;
                                return (
                                    <TouchableOpacity
                                        key={item.value}
                                        onPress={() => {
                                            setSelectedPeriod(item.value);
                                            setIsPeriodModalOpen(false);
                                        }}
                                        className={`py-3 px-4 rounded-xl flex-row justify-between items-center border ${
                                            isSelected
                                                ? "bg-primary-sub border-primary-main"
                                                : "bg-background border-border"
                                        }`}>
                                        <TextComponent
                                            className={`text-sm font-bold ${
                                                isSelected
                                                    ? "text-primary-dark"
                                                    : "text-text-primary"
                                            }`}>
                                            {item.label}
                                        </TextComponent>
                                        {isSelected && (
                                            <TextComponent className="text-primary-dark font-bold text-sm">
                                                ✓
                                            </TextComponent>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}
