import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Pressable,
    Keyboard,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Feather } from "@expo/vector-icons";

import Button from "@/components/common/button/Button";
import InputGroup from "@/components/common/input/InputGroup";
import Input from "@/components/common/input/Input";
import TextComponent from "@/components/common/text/TextComponent";

import { tripSchema, TripInputType } from "@/schemas/trip/tripSchema";
import { Trip, CurrencyCodeList } from "@/types/trip"; // 🆕 CurrencyCodeList 임포트
import Title from "@/components/common/title/Title";

interface TripFormModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: TripInputType) => void;
    initialData?: Trip | null; // null이면 추가, 데이터가 있으면 수정 모드
}

// 🆕 통화별 라벨 매핑 객체
const CURRENCY_LABELS: Record<string, string> = {
    JPY: "🇯🇵 일본 (JPY)",
    USD: "🇺🇸 미국 (USD)",
    EUR: "🇪🇺 유럽 (EUR)",
    GBP: "🇬🇧 영국 (GBP)",
    CNY: "🇨🇳 중국 (CNY)",
    KRW: "🇰🇷 한국 (KRW)",
};

export default function TripFormModal({
    visible,
    onClose,
    onSubmit,
    initialData,
}: TripFormModalProps) {
    const isEditMode = !!initialData;

    // 네이티브용 DatePicker 노출 상태
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TripInputType>({
        resolver: zodResolver(tripSchema),
        mode: "onBlur",
        defaultValues: {
            title: "",
            startDate: "",
            endDate: "",
            budgetKrw: 0,
            currency: "JPY", // 🆕 기본 통화 설정
        },
    });

    useEffect(() => {
        if (visible) {
            if (initialData) {
                reset({
                    title: initialData.title,
                    startDate: initialData.startDate,
                    endDate: initialData.endDate,
                    budgetKrw: initialData.budgetKrw,
                    currency: initialData.currency || "JPY", // 🛠️ 수정 시 기존 통화 불러오기
                });
            } else {
                reset({ title: "", startDate: "", endDate: "", budgetKrw: 0, currency: "JPY" });
            }
        }
    }, [visible, initialData, reset]);

    const handleFormSubmit = async (data: TripInputType) => {
        try {
            await onSubmit(data); // 부모 컴포넌트(TripListPage)에서 API 통신 및 리프레시 처리
            onClose();
        } catch (error) {
            console.log(error);

            const errorKeyword = isEditMode ? "수정" : "저장";

            if (Platform.OS === "web") {
                alert(`${errorKeyword} 중 문제가 발생했습니다.`);
            } else {
                Alert.alert("오류", `${errorKeyword} 중 문제가 발생했습니다.`);
            }
        }
    };

    /* ========================================
       날짜 선택기 렌더링 헬퍼 함수 (웹/앱 분기)
    ======================================== */
    const renderDatePicker = (
        value: string,
        onChange: (val: string) => void,
        showPicker: boolean,
        setShowPicker: (show: boolean) => void,
        errorMessage?: string,
    ) => {
        // 1. 웹 환경 (기본 input type="date" 사용)
        if (Platform.OS === "web") {
            return (
                <input
                    type="date"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className={`w-full px-4 py-4 bg-bg-paper border rounded-md text-sm text-text-primary outline-none ${
                        errorMessage ? "border-accent-coral" : "border-divider"
                    }`}
                    style={{ fontFamily: "inherit" }}
                />
            );
        }

        // 2. 앱 환경 (아이콘 + TouchableOpacity + DateTimePicker)
        const displayDate = value ? value.replace(/-/g, ".") : "YYYY.MM.DD";
        return (
            <>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setShowPicker(true)}
                    className={`w-full flex-row items-center rounded-md bg-bg-paper border px-4 py-4 ${
                        errorMessage ? "border-accent-coral" : "border-divider"
                    }`}>
                    <TextComponent
                        className={`flex-1 text-sm ${value ? "text-text-primary" : "text-[#B7C1BE]"}`}>
                        {displayDate}
                    </TextComponent>
                    <Feather name="calendar" size={18} color="#6BC1B6" />
                </TouchableOpacity>

                {showPicker && (
                    <DateTimePicker
                        value={value ? new Date(value) : new Date()}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, date) => {
                            if (Platform.OS !== "ios") setShowPicker(false);
                            if (date) onChange(format(date, "yyyy-MM-dd"));
                        }}
                    />
                )}
            </>
        );
    };

    return (
        <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}>
                {/* 바깥 영역 클릭 시 키보드 닫기 및 모달 종료 */}
                <Pressable
                    onPress={() => {
                        Keyboard.dismiss();
                        onClose();
                    }}
                    className="flex-1 justify-center items-center bg-black/50 p-6">
                    {/* 모달 컨텐츠 영역 (클릭해도 닫히지 않도록 stopPropagation 처리) */}
                    <Pressable
                        onPress={e => e.stopPropagation()}
                        className="bg-surface w-full max-w-xl rounded-3xl p-6 shadow-xl">
                        <Title
                            title={isEditMode ? "여행지 수정" : "여행지 추가"}
                            forceCenter={true}
                            className="h-auto pb-6 mb-3 text-center"
                        />

                        {/* 1. 여행 이름 */}
                        <Controller
                            control={control}
                            name="title"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup label="여행 이름" errorMessage={errors.title?.message}>
                                    <Input
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        hasError={!!errors.title}
                                        placeholder="예) 도쿄 가족 여행"
                                    />
                                </InputGroup>
                            )}
                        />

                        <Controller
                            control={control}
                            name="currency"
                            render={({ field: { onChange, value } }) => (
                                <InputGroup
                                    label="기준 통화 (국가)"
                                    errorMessage={errors.currency?.message}>
                                    <View className="flex-row flex-wrap gap-2">
                                        {CurrencyCodeList.map(curr => {
                                            const isSelected = value === curr;
                                            return (
                                                <Pressable
                                                    key={curr}
                                                    onPress={() => onChange(curr)}
                                                    className={`px-4 py-2.5 rounded-full border ${
                                                        isSelected
                                                            ? "bg-primary-main border-primary-main"
                                                            : "bg-surface border-divider"
                                                    }`}>
                                                    <TextComponent
                                                        className={`text-sm ${
                                                            isSelected
                                                                ? "text-white font-bold"
                                                                : "text-text-secondary"
                                                        }`}>
                                                        {CURRENCY_LABELS[curr] || curr}
                                                    </TextComponent>
                                                </Pressable>
                                            );
                                        })}
                                    </View>
                                </InputGroup>
                            )}
                        />

                        {/* 3. 시작일 */}
                        <Controller
                            control={control}
                            name="startDate"
                            render={({ field: { onChange, value } }) => (
                                <InputGroup label="시작일" errorMessage={errors.startDate?.message}>
                                    {renderDatePicker(
                                        value,
                                        onChange,
                                        showStartPicker,
                                        setShowStartPicker,
                                        errors.startDate?.message,
                                    )}
                                </InputGroup>
                            )}
                        />

                        {/* 4. 종료일 */}
                        <Controller
                            control={control}
                            name="endDate"
                            render={({ field: { onChange, value } }) => (
                                <InputGroup label="종료일" errorMessage={errors.endDate?.message}>
                                    {renderDatePicker(
                                        value,
                                        onChange,
                                        showEndPicker,
                                        setShowEndPicker,
                                        errors.endDate?.message,
                                    )}
                                </InputGroup>
                            )}
                        />

                        {/* 5. 총 예산 */}
                        <Controller
                            control={control}
                            name="budgetKrw"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="총 예산 (원화)"
                                    errorMessage={errors.budgetKrw?.message}>
                                    <View
                                        className={`w-full flex-row items-center rounded-md bg-bg-paper border px-4 py-4 ${
                                            errors.budgetKrw
                                                ? "border-accent-coral"
                                                : "border-divider"
                                        }`}>
                                        <TextComponent className="text-text-primary font-bold mr-2 text-sm">
                                            ₩
                                        </TextComponent>
                                        <Input
                                            hideBorder
                                            className="flex-1 p-0 m-0 text-sm"
                                            keyboardType="numeric"
                                            onBlur={onBlur}
                                            onChangeText={text => {
                                                const num = Number(text.replace(/[^0-9]/g, ""));
                                                onChange(num);
                                            }}
                                            value={
                                                value
                                                    ? new Intl.NumberFormat("ko-KR").format(value)
                                                    : ""
                                            }
                                            placeholder="1,000,000"
                                        />
                                    </View>
                                </InputGroup>
                            )}
                        />

                        {errors.root?.message && (
                            <TextComponent className="text-error text-center text-sm mt-1 mb-2">
                                {errors.root.message}
                            </TextComponent>
                        )}

                        {/* 6. 하단 버튼 영역 */}
                        <View className="flex-row mt-6 gap-3">
                            <Button variant="outlined" wrap={true} onPress={onClose}>
                                취소
                            </Button>
                            <Button
                                color="primary"
                                wrap={true}
                                onPress={handleSubmit(handleFormSubmit)}
                                disabled={isSubmitting}>
                                {isSubmitting ? "처리중..." : isEditMode ? "수정" : "저장"}
                            </Button>
                        </View>
                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
        </Modal>
    );
}
