import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, Image, ScrollView, Alert, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import Title from "@/components/common/title/Title";
import Card from "@/components/common/card/Card";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";
import LoadingIndicator from "@/components/common/loading/Loading";

import { ExpenseCategory, TripExpense, TripExpenseSummary } from "@/types/tripExpense";
import { CurrencyCode, Trip } from "@/types/trip";
import tripApi from "@/api/user/tripApi";
import tripExpenseApi from "@/api/user/tripExpenseApi";
import walletApi from "@/api/user/walletApi"; // 👈 지갑 목록 조회 API
import { getTripThumbnail } from "@/utils/tripImage";
import TripExpenseFormModal from "@/components/domain/tripExpense/TripExpenseFormModal";
import { TripExpenseInputType } from "@/schemas/tripExpense/tripExpenseSchema";

// 날짜 포맷 유틸리티 함수
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${year}.${month}.${day} (${dayOfWeek})`;
};

// 여행 기간 포맷 유틸리티 함수
const formatDateRange = (startDateString: string, endDateString: string): string => {
    const startDateFormatted = formatDate(startDateString);
    const endDate = new Date(endDateString);
    const month = String(endDate.getMonth() + 1).padStart(2, "0");
    const day = String(endDate.getDate()).padStart(2, "0");
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][endDate.getDay()];
    return `${startDateFormatted} ~ ${month}.${day} (${dayOfWeek})`;
};

// 통화 포맷 유틸리티 함수
const formatCurrency = (amount: number, currency: CurrencyCode | "KRW" = "KRW"): string => {
    const currencySymbols: Record<string, string> = {
        KRW: "₩",
        USD: "$",
        JPY: "¥",
        EUR: "€",
        GBP: "£",
        CNY: "¥",
    };
    const symbol = currencySymbols[currency] ?? "₩";
    const formattedAmount = amount.toLocaleString("ko-KR");
    return `${symbol} ${formattedAmount}`;
};

// 지출 카테고리 정보 매핑
const CATEGORY_INFO: Record<ExpenseCategory, { label: string; icon: string; color: string }> = {
    FOOD: { label: "식비", icon: "life-buoy", color: "#F97316" },
    TRANSPORT: { label: "교통", icon: "map-pin", color: "#10B981" },
    SHOPPING: { label: "쇼핑", icon: "shopping-bag", color: "#14B8A6" },
    OTHER: { label: "기타", icon: "box", color: "#A16207" },
};

export default function TripDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [trip, setTrip] = useState<Trip | null>(null);
    const [expenses, setExpenses] = useState<TripExpense[]>([]);
    const [wallets, setWallets] = useState<any[]>([]); // 👈 지갑 목록 상태
    const [isLoading, setIsLoading] = useState(true);

    // 모달 관련 상태
    const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<TripExpense | null>(null);

    // 데이터 로드
    const loadData = useCallback(async () => {
        if (!id) return;
        try {
            const numericTripId = Number(id);
            const [tripData, expensesData, walletList] = await Promise.all([
                tripApi.getTripById(numericTripId),
                tripExpenseApi.fetchTripExpenseList(numericTripId, 1, 100),
                walletApi.getMyWallets(), // 👈 지갑 배열을 직접 반환
            ]);

            setTrip(tripData);
            setExpenses(expensesData.list);
            setWallets(walletList ?? []); // 👈 깔끔하게 배열 상태로 세팅
        } catch (error) {
            console.error("데이터 로드 실패:", error);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadData().then(() => {});
    }, [loadData]);

    // 🌟 현재 여행 통화와 일치하는 지갑 ID 추출
    const currentWalletId = useMemo(() => {
        if (!trip || !wallets.length) return null;
        const matchedWallet = wallets.find(w => w.currency === trip.currency);
        return matchedWallet ? matchedWallet.id : null;
    }, [trip, wallets]);

    // 지출 합계 계산 (원화 환산 금액 기준)
    const totalExpenseKrw = useMemo(() => {
        return (expenses ?? []).reduce(
            (sum, expense) => sum + (expense?.convertedKrwAmount || 0),
            0,
        );
    }, [expenses]);

    // 지출 요약 데이터 계산
    const expenseSummary: TripExpenseSummary[] = useMemo(() => {
        const summaryMap: Record<ExpenseCategory, number> = {
            FOOD: 0,
            TRANSPORT: 0,
            SHOPPING: 0,
            OTHER: 0,
        };

        (expenses ?? []).forEach(expense => {
            if (expense?.category && summaryMap[expense.category] !== undefined) {
                summaryMap[expense.category] += expense.convertedKrwAmount || 0;
            }
        });

        return (Object.keys(summaryMap) as ExpenseCategory[])
            .map(category => {
                const amount = summaryMap[category];
                const percentage = totalExpenseKrw > 0 ? (amount / totalExpenseKrw) * 100 : 0;
                return {
                    category,
                    ...CATEGORY_INFO[category],
                    amount,
                    percentage: Math.round(percentage),
                };
            })
            .sort((a, b) => b.amount - a.amount);
    }, [expenses, totalExpenseKrw]);

    // 🆕 모달 제출 핸들러 (생성 & 수정 통합)
    const handleExpenseSubmit = async (formData: TripExpenseInputType) => {
        if (!trip) return;

        try {
            const requestData: TripExpenseInputType = {
                ...formData,
                currency: trip.currency,
                walletId: formData.isWalletLinked ? (formData.walletId ?? currentWalletId) : null,
            };

            if (selectedExpense) {
                // 수정 요청 API 호출
                await tripExpenseApi.updateTripExpense(trip.id, selectedExpense.id, requestData);
            } else {
                // 생성 요청 API 호출
                await tripExpenseApi.createTripExpense(trip.id, requestData);
            }

            setIsExpenseModalVisible(false);
            setSelectedExpense(null);
            await loadData();
        } catch (error) {
            console.error("지출 저장 에러:", error);
            const msg = selectedExpense ? "지출 수정에 실패했습니다." : "지출 등록에 실패했습니다.";
            if (Platform.OS === "web") {
                alert(msg);
            } else {
                Alert.alert("오류", msg);
            }
        }
    };

    if (isLoading || !trip) {
        return <LoadingIndicator color="#6bc1b6" fullScreen />;
    }

    return (
        <View className="flex-1 bg-background relative items-center">
            {/* 타이틀 영역 */}
            <View className="w-full max-w-2xl">
                <Title
                    title={trip.title}
                    showBackButton
                    onBackPress={() => router.back()}
                    className="bg-transparent"/>
            </View>

            <ScrollView
                className="flex-1 w-full"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ alignItems: "center", paddingBottom: 100 }}>
                <View className="w-full max-w-2xl px-5">
                    {/* 상단 이미지 + 여행 정보 통합 박스 */}
                    <View className="w-full bg-white rounded-[24px] overflow-hidden mb-8 shadow-sm border border-slate-50">
                        <View className="w-full aspect-[2/1] bg-slate-100">
                            <Image
                                source={getTripThumbnail(trip.currency)}
                                className="w-full h-full"
                                style={{ width: "100%", height: "100%" }}
                                resizeMode="cover"
                            />
                        </View>

                        <View className="p-6">
                            <View className="flex-row justify-between items-center mb-4">
                                <TextComponent className="text-text-secondary text-[15px] font-medium">
                                    여행 기간
                                </TextComponent>
                                <TextComponent className="text-text-primary text-[15px] font-bold">
                                    {formatDateRange(trip.startDate, trip.endDate)}
                                </TextComponent>
                            </View>

                            <View className="flex-row justify-between items-center mb-4">
                                <TextComponent className="text-text-secondary text-[15px] font-medium">
                                    예산 (원화)
                                </TextComponent>
                                <TextComponent className="text-text-primary text-[15px] font-bold">
                                    {formatCurrency(trip.budgetKrw, "KRW")}
                                </TextComponent>
                            </View>

                            <View className="flex-row justify-between items-center mb-4">
                                <TextComponent className="text-text-secondary text-[15px] font-medium">
                                    지출 (원화)
                                </TextComponent>
                                <TextComponent className="text-text-primary text-[15px] font-bold">
                                    {formatCurrency(totalExpenseKrw, "KRW")}
                                </TextComponent>
                            </View>

                            <View className="flex-row justify-between items-center">
                                <TextComponent className="text-text-secondary text-[15px] font-medium">
                                    남은 금액
                                </TextComponent>
                                <TextComponent className="text-primary-main text-[17px] font-extrabold">
                                    {formatCurrency(trip.budgetKrw - totalExpenseKrw, "KRW")}
                                </TextComponent>
                            </View>
                        </View>
                    </View>

                    {/* 지출 요약 카드 */}
                    <TextComponent className="text-text-primary text-[17px] font-bold mb-4 px-2">
                        지출 요약
                    </TextComponent>

                    <Card className="p-6 mb-6 shadow-sm border border-slate-50">
                        {expenseSummary.map(item => (
                            <View
                                className="flex-row items-center justify-between mb-5 last:mb-0"
                                key={item.category}>
                                <View className="flex-row items-center gap-4">
                                    <View
                                        className="p-2.5 rounded-full"
                                        style={{ backgroundColor: `${item.color}15` }}>
                                        <Feather
                                            color={item.color}
                                            name={item.icon as any}
                                            size={18}
                                        />
                                    </View>
                                    <TextComponent className="text-text-primary text-[15px] font-medium">
                                        {item.label}
                                    </TextComponent>
                                </View>

                                <View className="flex-row items-center gap-6">
                                    <TextComponent className="text-text-primary text-[15px] font-bold">
                                        {formatCurrency(item.amount, "KRW")}
                                    </TextComponent>
                                    <TextComponent className="text-text-secondary text-[14px] w-10 text-right">
                                        {item.percentage}%
                                    </TextComponent>
                                </View>
                            </View>
                        ))}
                    </Card>
                </View>
            </ScrollView>

            {/* 플로팅 버튼 */}
            <View className="absolute bottom-6 w-full max-w-2xl items-end px-5 pointer-events-none">
                <Button
                    className="p-4 shadow-lg shadow-primary-main/30 pointer-events-auto"
                    color="primary"
                    shape="circle"
                    size="large"
                    variant="contained"
                    onPress={() => {
                        setSelectedExpense(null);
                        setIsExpenseModalVisible(true);
                    }}>
                    <Feather color="white" name="plus" size={28} />
                </Button>
            </View>

            {/* 지출 추가/수정 모달 */}
            <TripExpenseFormModal
                visible={isExpenseModalVisible}
                tripCurrency={trip.currency}
                walletId={currentWalletId}
                initialData={selectedExpense}
                onClose={() => {
                    setIsExpenseModalVisible(false);
                    setSelectedExpense(null);
                }}
                onSubmit={handleExpenseSubmit}
            />
        </View>
    );
}
