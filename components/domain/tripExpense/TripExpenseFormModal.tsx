import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Pressable,
    Keyboard,
    Switch,
} from "react-native";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Feather } from "@expo/vector-icons";

import Button from "@/components/common/button/Button";
import InputGroup from "@/components/common/input/InputGroup";
import Input from "@/components/common/input/Input";
import TextComponent from "@/components/common/text/TextComponent";
import Title from "@/components/common/title/Title";

import { CurrencyCode } from "@/types/trip";
import { ExpenseCategory, PaymentMethod, TripExpense } from "@/types/tripExpense";
import { TripExpenseInputType, tripExpenseSchema } from "@/schemas/tripExpense/tripExpenseSchema";

interface TripExpenseFormModalProps {
    visible: boolean;
    tripCurrency: CurrencyCode; // 상위에서 전달받는 고정 통화
    walletId?: number | null; // 부모에서 전달받은 연동 지갑 ID
    onClose: () => void;
    onSubmit: (data: TripExpenseInputType) => void;
    initialData?: TripExpense | null;
}

// UI 매핑용 상수
const CATEGORY_OPTIONS: { label: string; value: ExpenseCategory; icon: any }[] = [
    { label: "식비", value: "FOOD", icon: "life-buoy" },
    { label: "교통", value: "TRANSPORT", icon: "map-pin" },
    { label: "쇼핑", value: "SHOPPING", icon: "shopping-bag" },
    { label: "기타", value: "OTHER", icon: "box" },
];

const PAYMENT_OPTIONS: { label: string; value: PaymentMethod }[] = [
    { label: "현금", value: "CASH" },
    { label: "카드", value: "CARD" },
    { label: "지갑(트래블페이)", value: "WALLET" },
];

export default function TripExpenseFormModal({
    visible,
    tripCurrency,
    walletId,
    onClose,
    onSubmit,
    initialData,
}: TripExpenseFormModalProps) {
    const isEditMode = !!initialData;

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<TripExpenseInputType>({
        resolver: zodResolver(tripExpenseSchema),
        mode: "onChange",
        defaultValues: {
            currency: tripCurrency,
            amount: 0,
            convertedKrwAmount: 0,
            category: "FOOD",
            paymentMethod: "CASH",
            isWalletLinked: false,
            walletId: walletId ?? null,
            expenseDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
            merchant: "",
            memo: "",
        },
    });

    // 임시 Mock 환율
    const mockExchangeRate: Record<CurrencyCode, number> = {
        KRW: 1,
        USD: 1350,
        JPY: 9,
        EUR: 1450,
        GBP: 1700,
        CNY: 190,
    };

    const currentAmount = watch("amount");

    // 현지 통화 입력 시 원화 금액 자동 계산
    useEffect(() => {
        if (currentAmount > 0) {
            const rate = mockExchangeRate[tripCurrency] || 1;
            setValue("convertedKrwAmount", currentAmount * rate);
        } else {
            setValue("convertedKrwAmount", 0);
        }
    }, [currentAmount, tripCurrency, setValue]);

    // 모달 열림 및 초기 데이터 변경 시 폼 리셋
    useEffect(() => {
        if (visible) {
            if (initialData) {
                reset({
                    currency: initialData.currency,
                    amount: initialData.amount,
                    convertedKrwAmount: initialData.convertedKrwAmount,
                    category: initialData.category,
                    paymentMethod: initialData.paymentMethod,
                    isWalletLinked: initialData.isWalletLinked,
                    expenseDate: initialData.expenseDate,
                    merchant: initialData.merchant || "",
                    memo: initialData.memo || "",
                    walletId: initialData.walletId ?? walletId ?? null,
                });
            } else {
                reset({
                    currency: tripCurrency,
                    amount: 0,
                    convertedKrwAmount: 0,
                    category: "FOOD",
                    paymentMethod: "CASH",
                    isWalletLinked: false,
                    walletId: walletId ?? null,
                    expenseDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
                    merchant: "",
                    memo: "",
                });
            }
        }
    }, [visible, initialData, reset, tripCurrency, walletId]);

    const handleFormSubmit = async (data: TripExpenseInputType) => {
        try {
            await onSubmit(data);
        } catch (error) {
            console.error(error);
            Alert.alert("오류", `${isEditMode ? "수정" : "저장"} 중 문제가 발생했습니다.`);
        }
    };

    return (
        <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}>
                <Pressable
                    onPress={() => {
                        Keyboard.dismiss();
                        onClose();
                    }}
                    className="flex-1 justify-center items-center bg-black/50 p-6">
                    <Pressable
                        onPress={e => e.stopPropagation()}
                        className="bg-surface w-full max-w-xl rounded-3xl p-6 shadow-xl">
                        <Title
                            title={isEditMode ? "지출 내역 수정" : "지출 추가"}
                            className="h-auto pb-4 mb-2 px-0"
                        />

                        {/* 1. 고정된 통화 표시 */}
                        <View className="mb-5 flex-row items-center justify-between bg-bg-paper p-4 rounded-md border border-divider">
                            <TextComponent className="text-text-secondary text-sm font-medium">
                                적용 통화
                            </TextComponent>
                            <TextComponent className="text-primary-main font-bold text-base">
                                {tripCurrency}
                            </TextComponent>
                        </View>

                        {/* 2. 금액 입력 (현지 통화) + 자동 변환된 원화 표시 */}
                        <Controller
                            control={control}
                            name="amount"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="지출 금액 (현지 통화)"
                                    errorMessage={errors.amount?.message}>
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-row items-center flex-1 border border-primary-main rounded-md px-4 py-3">
                                            <TextComponent className="text-primary-main font-bold mr-2 text-base">
                                                {tripCurrency === "JPY"
                                                    ? "¥"
                                                    : tripCurrency === "USD"
                                                      ? "$"
                                                      : tripCurrency === "EUR"
                                                        ? "€"
                                                        : "₩"}
                                            </TextComponent>
                                            <Input
                                                hideBorder
                                                className="flex-1 p-0 m-0 text-base font-bold text-text-primary"
                                                keyboardType="numeric"
                                                onBlur={onBlur}
                                                onChangeText={text =>
                                                    onChange(Number(text.replace(/[^0-9]/g, "")))
                                                }
                                                value={
                                                    value
                                                        ? new Intl.NumberFormat("ko-KR").format(
                                                              value,
                                                          )
                                                        : ""
                                                }
                                                placeholder="0"
                                            />
                                        </View>

                                        <View className="ml-4 items-end">
                                            <TextComponent className="text-text-secondary text-xs">
                                                예상 원화 금액
                                            </TextComponent>
                                            <TextComponent className="text-text-primary font-bold">
                                                ≈ ₩{" "}
                                                {new Intl.NumberFormat("ko-KR").format(
                                                    watch("convertedKrwAmount"),
                                                )}
                                            </TextComponent>
                                        </View>
                                    </View>
                                </InputGroup>
                            )}
                        />

                        {/* 3. 카테고리 선택 */}
                        <Controller
                            control={control}
                            name="category"
                            render={({ field: { onChange, value } }) => (
                                <InputGroup
                                    label="카테고리"
                                    errorMessage={errors.category?.message}>
                                    <View className="flex-row flex-wrap gap-2">
                                        {CATEGORY_OPTIONS.map(opt => (
                                            <Pressable
                                                key={opt.value}
                                                onPress={() => onChange(opt.value)}
                                                className={`flex-row items-center px-4 py-2.5 rounded-full border ${
                                                    value === opt.value
                                                        ? "bg-primary-main border-primary-main"
                                                        : "bg-surface border-divider"
                                                }`}>
                                                <Feather
                                                    name={opt.icon}
                                                    size={14}
                                                    color={
                                                        value === opt.value ? "white" : "#86918c"
                                                    }
                                                    className="mr-1.5"
                                                />
                                                <TextComponent
                                                    className={`text-sm ${
                                                        value === opt.value
                                                            ? "text-white font-bold"
                                                            : "text-text-secondary"
                                                    }`}>
                                                    {opt.label}
                                                </TextComponent>
                                            </Pressable>
                                        ))}
                                    </View>
                                </InputGroup>
                            )}
                        />

                        {/* 4. 가맹점 입력란 */}
                        <Controller
                            control={control}
                            name="merchant"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="사용처 (가맹점)"
                                    errorMessage={errors.merchant?.message}>
                                    <Input
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="예) 스타벅스 신주쿠점"
                                    />
                                </InputGroup>
                            )}
                        />

                        {/* 5. 결제 수단 및 지갑 연동 토글 */}
                        {/* 5. 결제 수단 및 지갑 연동 토글 */}
                        <View className="mb-2">
                            <View className="flex-row gap-4 items-center">
                                {/* 결제 수단 선택 */}
                                <Controller
                                    control={control}
                                    name="paymentMethod"
                                    render={({ field: { onChange, value } }) => (
                                        <View className="flex-1">
                                            <TextComponent className="font-semibold ml-1 text-text-primary text-sm mb-1.5">
                                                결제 수단
                                            </TextComponent>
                                            <View className="flex-row flex-wrap gap-2">
                                                {PAYMENT_OPTIONS.map(opt => (
                                                    <Pressable
                                                        key={opt.value}
                                                        onPress={() => {
                                                            onChange(opt.value);

                                                            // 🌟 결제 수단에 따라 지갑 연동 상태 강제 동기화
                                                            if (opt.value === "WALLET") {
                                                                setValue("isWalletLinked", true, {
                                                                    shouldValidate: true,
                                                                });
                                                            } else {
                                                                setValue("isWalletLinked", false, {
                                                                    shouldValidate: true,
                                                                });
                                                            }
                                                        }}
                                                        className={`px-3 py-2 rounded-md border ${
                                                            value === opt.value
                                                                ? "bg-primary-sub border-primary-main"
                                                                : "bg-surface border-divider"
                                                        }`}>
                                                        <TextComponent
                                                            className={`text-sm ${
                                                                value === opt.value
                                                                    ? "text-primary-main font-bold"
                                                                    : "text-text-secondary"
                                                            }`}>
                                                            {opt.label}
                                                        </TextComponent>
                                                    </Pressable>
                                                ))}
                                            </View>
                                        </View>
                                    )}
                                />

                                {/* 지갑 연동 스위치 */}
                                <Controller
                                    control={control}
                                    name="isWalletLinked"
                                    render={({ field: { onChange, value } }) => {
                                        const currentPaymentMethod = watch("paymentMethod");
                                        const isWalletMethod = currentPaymentMethod === "WALLET";
                                        // 🌟 결제수단이 WALLET이 아니거나, 실제 지갑이 없는 경우 스위치 비활성화
                                        const isDisabled = !isWalletMethod || !walletId;

                                        return (
                                            <View className="justify-center items-center px-2">
                                                <TextComponent className="font-semibold text-text-primary text-xs mb-2">
                                                    지갑 연동
                                                </TextComponent>
                                                <Switch
                                                    trackColor={{
                                                        false: "#E2E8F0",
                                                        true: "#6BC1B6",
                                                    }}
                                                    thumbColor={
                                                        Platform.OS === "ios"
                                                            ? "#FFFFFF"
                                                            : value
                                                              ? "#FFFFFF"
                                                              : "#F8FAFC"
                                                    }
                                                    onValueChange={nextVal => {
                                                        if (!walletId && nextVal) {
                                                            Alert.alert(
                                                                "알림",
                                                                `${tripCurrency} 지갑이 없습니다. 지갑을 먼저 생성해주세요.`,
                                                            );
                                                            return;
                                                        }
                                                        onChange(nextVal);
                                                    }}
                                                    value={value}
                                                    disabled={isDisabled} // 👈 조건 미충족 시 클릭 차단
                                                />
                                            </View>
                                        );
                                    }}
                                />
                            </View>

                            {/* 지갑 에러 메시지 표시 */}
                            {errors.walletId && (
                                <TextComponent className="text-red-500 text-xs mt-1.5 ml-1">
                                    {errors.walletId.message}
                                </TextComponent>
                            )}
                        </View>

                        {/* 하단 버튼 영역 */}
                        <View className="flex-row mt-4 gap-3">
                            <Button variant="outlined" wrap={true} onPress={onClose}>
                                취소
                            </Button>
                            <Button
                                color="primary"
                                wrap={true}
                                onPress={handleSubmit(handleFormSubmit, err =>
                                    console.log("유효성 검사 에러:", err),
                                )}
                                disabled={isSubmitting}>
                                {isSubmitting ? "처리중..." : isEditMode ? "수정하기" : "저장하기"}
                            </Button>
                        </View>
                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
        </Modal>
    );
}
