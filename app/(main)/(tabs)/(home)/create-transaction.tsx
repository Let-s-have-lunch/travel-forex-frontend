import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Modal,
    Alert,
    Platform,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";
import Input from "@/components/common/input/Input";
import Card from "@/components/common/card/Card";
import axiosInstance from "@/api/axiosInstance";

// 통화 메타데이터
const CURRENCY_OPTIONS = [
    {
        code: "USD",
        name: "USD - 미국 달러",
        symbol: "$",
        flagUrl: "https://flagcdn.com/w160/us.png",
        rate: 1424,
    },
    {
        code: "JPY",
        name: "JPY - 일본 엔",
        symbol: "¥",
        flagUrl: "https://flagcdn.com/w160/jp.png",
        rate: 9.13,
    },
    {
        code: "EUR",
        name: "EUR - 유로",
        symbol: "€",
        flagUrl: "https://flagcdn.com/w160/eu.png",
        rate: 1385,
    },
    {
        code: "CNY",
        name: "CNY - 중국 위안",
        symbol: "¥",
        flagUrl: "https://flagcdn.com/w160/cn.png",
        rate: 195,
    },
    {
        code: "GBP",
        name: "GBP - 영국 파운드",
        symbol: "£",
        flagUrl: "https://flagcdn.com/w160/gb.png",
        rate: 1780,
    },
    {
        code: "KRW",
        name: "KRW - 대한민국 원",
        symbol: "₩",
        flagUrl: "https://flagcdn.com/w160/kr.png",
        rate: 1,
    },
];

const PAYMENT_METHODS = ["은행 계좌", "신용/체크카드", "현금", "기타"];
const DAYS_OF_WEEK = ["일", "월", "화", "수", "목", "금", "토"];

export default function CreateTransactionPage() {
    const router = useRouter();
    const { type } = useLocalSearchParams<{ type: "DEPOSIT" | "WITHDRAW" | "WITHDRAWAL" }>();

    const isDeposit = type !== "WITHDRAW" && type !== "WITHDRAWAL";
    const typeLabel = isDeposit ? "입금" : "출금";

    // 폼 상태값
    const [selectedCurrency, setSelectedCurrency] = useState(CURRENCY_OPTIONS[0]);
    const [amount, setAmount] = useState("");
    const [selectedMethod, setSelectedMethod] = useState("은행 계좌");
    const [memo, setMemo] = useState("");

    // 날짜 상태값
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [calYear, setCalYear] = useState(new Date().getFullYear());
    const [calMonth, setCalMonth] = useState(new Date().getMonth());
    const [tempSelectedDay, setTempSelectedDay] = useState(new Date().getDate());

    // 모달 상태값
    const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
    const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [wallets, setWallets] = useState<any[]>([]);

    useEffect(() => {
        axiosInstance
            .get("/wallets")
            .then(res => {
                const data = res.data?.data || (Array.isArray(res.data) ? res.data : []);
                setWallets(data);
            })
            .catch(err => console.error("지갑 조회 실패:", err));
    }, []);

    // 화면 표시용 날짜 포맷 (예: 2026.08.21 (금))
    const formatDisplayDate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const date = String(d.getDate()).padStart(2, "0");
        const dayName = DAYS_OF_WEEK[d.getDay()];
        return `${year}.${month}.${date} (${dayName})`;
    };

    // 백엔드 전송용 날짜 포맷 ("YYYY-MM-DDTHH:mm:ss")
    const formatBackendDate = (d: Date) => {
        const pad = (n: number) => String(n).padStart(2, "0");
        const now = new Date();
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    };

    // 캘린더 날짜 계산
    const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
    const totalDaysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

    const handlePrevMonth = () => {
        if (calMonth === 0) {
            setCalMonth(11);
            setCalYear(calYear - 1);
        } else {
            setCalMonth(calMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (calMonth === 11) {
            setCalMonth(0);
            setCalYear(calYear + 1);
        } else {
            setCalMonth(calMonth + 1);
        }
    };

    const handleConfirmDate = () => {
        const newDate = new Date(calYear, calMonth, tempSelectedDay);
        setSelectedDate(newDate);
        setIsDateModalOpen(false);
    };

    // 실시간 원화 환산 계산
    const numAmount = parseFloat(amount) || 0;
    const calculatedKRW =
        selectedCurrency.code === "KRW"
            ? numAmount
            : Math.round(
                  numAmount *
                      (selectedCurrency.code === "JPY"
                          ? selectedCurrency.rate / 100
                          : selectedCurrency.rate),
              );

    const handleSubmit = async () => {
        if (!amount || numAmount <= 0) {
            Alert.alert("알림", "금액을 입력해주세요.");
            return;
        }

        try {
            setIsSubmitting(true);

            let targetWallet = wallets.find(w => w.currency === selectedCurrency.code);
            let walletId = targetWallet?.id || targetWallet?.walletId;

            if (!walletId) {
                const newWalletRes = await axiosInstance.post("/wallets", {
                    currency: selectedCurrency.code,
                    balance: 0,
                });
                const newWallet = newWalletRes.data?.data;
                walletId = newWallet?.id || newWallet?.walletId;
            }

            await axiosInstance.post(`/wallets/${walletId}/transactions`, {
                transactionType: isDeposit ? "DEPOSIT" : "WITHDRAWAL",
                amount: numAmount,
                appliedExchangeRate: selectedCurrency.rate,
                convertedKrwAmount: calculatedKRW,
                transactionMethod: selectedMethod,
                transactionDate: formatBackendDate(selectedDate),
                memo: memo.trim() || undefined,
            });

            router.replace("/(main)/(tabs)/(home)" as any);
        } catch (error: any) {
            console.error("거래 등록 에러:", error?.response?.data);
            const msg = error?.response?.data?.message || "거래 등록에 실패했습니다.";
            if (Platform.OS === "web") window.alert(msg);
            else Alert.alert("알림", msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
            <StatusBar style="dark" />

            <View className="flex-1 px-6 max-w-[600px] w-full self-center">
                {/* 1. 상단 네비게이션 헤더 */}
                <View className="relative py-4 items-center justify-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute left-0 w-10 h-10 items-start justify-center">
                        <TextComponent className="text-2xl font-bold text-text-primary">
                            ‹
                        </TextComponent>
                    </TouchableOpacity>

                    <TextComponent className="text-lg font-bold text-text-primary">
                        {typeLabel} 추가
                    </TextComponent>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}>
                    {/* 2. 통화 선택 */}
                    <TextComponent className="text-xs font-semibold text-text-primary mb-2">
                        통화 선택
                    </TextComponent>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setIsCurrencyModalOpen(true)}
                        className="mb-5">
                        <Card
                            className="flex-row justify-between items-center bg-card border border-border px-4 py-3.5 rounded-2xl"
                            shadow="none">
                            <View className="flex-row items-center">
                                <Image
                                    source={{ uri: selectedCurrency.flagUrl }}
                                    className="w-6 h-6 rounded-full mr-2.5"
                                    resizeMode="cover"
                                />
                                <TextComponent className="text-sm font-bold text-text-primary">
                                    {selectedCurrency.name}
                                </TextComponent>
                            </View>
                            <TextComponent className="text-xs text-text-tertiary">▼</TextComponent>
                        </Card>
                    </TouchableOpacity>

                    {/* 3. 일시 선택 */}
                    <TextComponent className="text-xs font-semibold text-text-primary mb-2">
                        {typeLabel} 일시
                    </TextComponent>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            setCalYear(selectedDate.getFullYear());
                            setCalMonth(selectedDate.getMonth());
                            setTempSelectedDay(selectedDate.getDate());
                            setIsDateModalOpen(true);
                        }}
                        className="mb-5">
                        <Card
                            className="flex-row justify-between items-center bg-card border border-border px-4 py-3.5 rounded-2xl"
                            shadow="none">
                            <TextComponent className="text-sm font-semibold text-text-primary">
                                {formatDisplayDate(selectedDate)}
                            </TextComponent>
                            <TextComponent className="text-base">📅</TextComponent>
                        </Card>
                    </TouchableOpacity>

                    {/* 4. 금액 입력 */}
                    <TextComponent className="text-xs font-semibold text-text-primary mb-2">
                        {typeLabel} 금액
                    </TextComponent>
                    <Card
                        className="flex-row justify-between items-center bg-card border border-border px-4 py-3 rounded-2xl mb-5"
                        shadow="none">
                        <View className="flex-row items-center flex-1 mr-2">
                            <TextComponent className="text-base font-bold text-text-primary mr-2">
                                {selectedCurrency.symbol}
                            </TextComponent>
                            <Input
                                value={amount}
                                onChangeText={setAmount}
                                placeholder="0.00"
                                placeholderTextColor="#86918C"
                                keyboardType="numeric"
                                className="flex-1 text-base font-bold text-text-primary p-0 border-0 bg-transparent"
                            />
                        </View>
                        <TextComponent className="text-xs font-medium text-text-tertiary">
                            ≈ ₩ {calculatedKRW.toLocaleString("ko-KR")}
                        </TextComponent>
                    </Card>

                    {/* 5. 방법 선택 */}
                    <TextComponent className="text-xs font-semibold text-text-primary mb-2">
                        {typeLabel} 방법 (선택)
                    </TextComponent>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setIsMethodModalOpen(true)}
                        className="mb-5">
                        <Card
                            className="flex-row justify-between items-center bg-card border border-border px-4 py-3.5 rounded-2xl"
                            shadow="none">
                            <TextComponent className="text-sm font-medium text-text-primary">
                                {selectedMethod}
                            </TextComponent>
                            <TextComponent className="text-xs text-text-tertiary">▼</TextComponent>
                        </Card>
                    </TouchableOpacity>

                    {/* 6. 메모 입력 */}
                    <TextComponent className="text-xs font-semibold text-text-primary mb-2">
                        메모 (선택)
                    </TextComponent>
                    <View className="mb-8">
                        <Input
                            value={memo}
                            onChangeText={setMemo}
                            placeholder="메모를 입력하세요."
                            placeholderTextColor="#86918C"
                            multiline
                            numberOfLines={4}
                            style={{ height: 120, textAlignVertical: "top" }}
                            className="bg-card border-border rounded-2xl p-4 text-sm text-text-primary"
                        />
                    </View>

                    {/* 7. 저장하기 버튼 */}
                    <Button
                        color="primary"
                        size="large"
                        fullWidth
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                        className="py-4 rounded-2xl items-center justify-center shadow-none"
                        textClassName="text-base font-bold text-white">
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            "저장하기"
                        )}
                    </Button>
                </ScrollView>
            </View>

            {/* 📅 캘린더 날짜 선택 모달 */}
            <Modal visible={isDateModalOpen} transparent animationType="fade">
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setIsDateModalOpen(false)}
                    className="flex-1 justify-center items-center bg-black/40 px-6">
                    <View
                        className="bg-card w-full max-w-[360px] rounded-3xl p-5 border border-border"
                        onStartShouldSetResponder={() => true}>
                        {/* 월 이동 헤더 */}
                        <View className="flex-row justify-between items-center mb-4">
                            <TouchableOpacity onPress={handlePrevMonth} className="p-2">
                                <TextComponent className="text-lg font-bold text-text-primary">
                                    ‹
                                </TextComponent>
                            </TouchableOpacity>
                            <TextComponent className="text-base font-bold text-text-primary">
                                {calYear}년 {calMonth + 1}월
                            </TextComponent>
                            <TouchableOpacity onPress={handleNextMonth} className="p-2">
                                <TextComponent className="text-lg font-bold text-text-primary">
                                    ›
                                </TextComponent>
                            </TouchableOpacity>
                        </View>

                        {/* 요일 헤더 */}
                        <View className="flex-row justify-between mb-2">
                            {DAYS_OF_WEEK.map((d, i) => (
                                <TextComponent
                                    key={d}
                                    className={`w-9 text-center text-xs font-semibold ${
                                        i === 0 ? "text-error" : "text-text-secondary"
                                    }`}>
                                    {d}
                                </TextComponent>
                            ))}
                        </View>

                        {/* 날짜 그리드 */}
                        <View className="flex-row flex-wrap mb-4">
                            {Array.from({ length: firstDayIndex }).map((_, i) => (
                                <View key={`empty-${i}`} className="w-[14.28%] h-9" />
                            ))}
                            {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const isSelected = day === tempSelectedDay;
                                return (
                                    <TouchableOpacity
                                        key={day}
                                        onPress={() => setTempSelectedDay(day)}
                                        className="w-[14.28%] h-9 items-center justify-center">
                                        <View
                                            className={`w-8 h-8 rounded-full items-center justify-center ${
                                                isSelected ? "bg-primary-main" : ""
                                            }`}>
                                            <TextComponent
                                                className={`text-xs font-semibold ${
                                                    isSelected ? "text-white" : "text-text-primary"
                                                }`}>
                                                {day}
                                            </TextComponent>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* 모달 확인 버튼 */}
                        <Button
                            color="primary"
                            size="medium"
                            fullWidth
                            onPress={handleConfirmDate}
                            className="mt-2 py-3.5 rounded-xl items-center justify-center"
                            textClassName="text-sm font-bold text-white">
                            확인
                        </Button>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* 통화 선택 모달 */}
            <Modal visible={isCurrencyModalOpen} transparent animationType="fade">
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setIsCurrencyModalOpen(false)}
                    className="flex-1 justify-center items-center bg-black/40 px-6">
                    <View className="bg-card w-full max-w-[360px] rounded-3xl p-5 border border-border">
                        <TextComponent className="text-base font-bold text-text-primary mb-4 text-center">
                            통화 선택
                        </TextComponent>
                        {CURRENCY_OPTIONS.map(item => (
                            <TouchableOpacity
                                key={item.code}
                                onPress={() => {
                                    setSelectedCurrency(item);
                                    setIsCurrencyModalOpen(false);
                                }}
                                className="flex-row items-center py-3 border-b border-divider/50">
                                <Image
                                    source={{ uri: item.flagUrl }}
                                    className="w-6 h-6 rounded-full mr-3"
                                    resizeMode="cover"
                                />
                                <TextComponent className="text-sm font-semibold text-text-primary">
                                    {item.name}
                                </TextComponent>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* 방법 선택 모달 */}
            <Modal visible={isMethodModalOpen} transparent animationType="fade">
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setIsMethodModalOpen(false)}
                    className="flex-1 justify-center items-center bg-black/40 px-6">
                    <View className="bg-card w-full max-w-[360px] rounded-3xl p-5 border border-border">
                        <TextComponent className="text-base font-bold text-text-primary mb-4 text-center">
                            {typeLabel} 방법 선택
                        </TextComponent>
                        {PAYMENT_METHODS.map(method => (
                            <TouchableOpacity
                                key={method}
                                onPress={() => {
                                    setSelectedMethod(method);
                                    setIsMethodModalOpen(false);
                                }}
                                className="py-3.5 border-b border-divider/50 items-center">
                                <TextComponent className="text-sm font-semibold text-text-primary">
                                    {method}
                                </TextComponent>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}
