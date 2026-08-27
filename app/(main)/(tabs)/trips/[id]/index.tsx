import React, { useState } from "react";
import { View, ScrollView, Alert, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

// Components
import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";
import LoadingIndicator from "@/components/common/loading/Loading";
import TripExpenseFormModal from "@/components/domain/tripExpense/TripExpenseFormModal";

// Domain Components & Hooks
import { useTripDetail } from "@/hooks/useTripDetail";

// Types & API
import { TripExpense } from "@/types/tripExpense";
import { TripExpenseInputType } from "@/schemas/tripExpense/tripExpenseSchema";
import tripExpenseApi from "@/api/user/tripExpenseApi";
import TripInfoCard from "@/components/domain/trips/TripInfoCard";
import ExpenseSummaryList from "@/components/domain/trips/ExpenseSummaryList";

export default function TripDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    // 💡 비즈니스 로직과 데이터는 훅에서 가져옵니다.
    const { trip, isLoading, currentWalletId, totalExpenseKrw, expenseSummary, reloadData } =
        useTripDetail(id);

    // 모달 상태 관리
    const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<TripExpense | null>(null);

    const handleExpenseSubmit = async (formData: TripExpenseInputType) => {
        if (!trip) return;
        try {
            const requestData: TripExpenseInputType = {
                ...formData,
                currency: trip.currency,
                walletId: formData.isWalletLinked ? (formData.walletId ?? currentWalletId) : null,
            };

            if (selectedExpense) {
                await tripExpenseApi.updateTripExpense(trip.id, selectedExpense.id, requestData);
            } else {
                await tripExpenseApi.createTripExpense(trip.id, requestData);
            }

            closeModal();
            await reloadData();
        } catch (error) {
            console.error("지출 저장 에러:", error);
            const msg = selectedExpense ? "지출 수정에 실패했습니다." : "지출 등록에 실패했습니다.";
            Platform.OS === "web" ? alert(msg) : Alert.alert("오류", msg);
        }
    };

    const openModal = (expense: TripExpense | null = null) => {
        setSelectedExpense(expense);
        setIsExpenseModalVisible(true);
    };

    const closeModal = () => {
        setIsExpenseModalVisible(false);
        setSelectedExpense(null);
    };

    if (isLoading || !trip) return <LoadingIndicator color="#6bc1b6" fullScreen />;

    return (
        <View className="flex-1 bg-background relative items-center">
            {/* 1. 헤더 */}
            <View className="w-full max-w-2xl">
                <Title
                    title={trip.title}
                    showBackButton
                    onBackPress={() => router.back()}
                    className="bg-transparent"
                />
            </View>

            {/* 2. 본문 영역 */}
            <ScrollView
                className="flex-1 w-full"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ alignItems: "center", paddingBottom: 100 }}>
                <View className="w-full max-w-2xl px-5">
                    {/* 상단 여행 상세 정보 */}
                    <TripInfoCard trip={trip} totalExpenseKrw={totalExpenseKrw} />

                    {/* 지출 요약 리스트 */}
                    <TextComponent className="text-text-primary text-[17px] font-bold mb-4 px-2">
                        지출 요약
                    </TextComponent>
                    <ExpenseSummaryList summary={expenseSummary} />
                </View>
            </ScrollView>

            {/* 3. 플로팅 버튼 (지출 추가) */}
            <View className="absolute bottom-6 w-full max-w-2xl items-end px-5 pointer-events-none">
                <Button
                    className="p-4 shadow-lg shadow-primary-main/30 pointer-events-auto"
                    color="primary"
                    shape="circle"
                    size="large"
                    variant="contained"
                    onPress={() => openModal()}>
                    <Feather color="white" name="plus" size={28} />
                </Button>
            </View>

            {/* 4. 지출 폼 모달 */}
            <TripExpenseFormModal
                visible={isExpenseModalVisible}
                tripCurrency={trip.currency}
                walletId={currentWalletId}
                initialData={selectedExpense}
                onClose={closeModal}
                onSubmit={handleExpenseSubmit}
            />
        </View>
    );
}
