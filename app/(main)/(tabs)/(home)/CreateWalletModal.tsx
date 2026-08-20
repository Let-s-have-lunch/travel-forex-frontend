import {useEffect, useState } from "react";
import {
    View,
    TouchableOpacity,
    Modal,
    TextInput,
    ActivityIndicator,
    Alert,
    Platform,
} from "react-native";
import axiosInstance from "@/api/axiosInstance";
import TextComponent from "@/components/common/text/TextComponent";

interface CreateWalletModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CURRENCY_OPTIONS = [
    { code: "USD", flag: "🇺🇸", symbol: "$" },
    { code: "JPY", flag: "🇯🇵", symbol: "¥" },
    { code: "EUR", flag: "🇪🇺", symbol: "€" },
    { code: "CNY", flag: "🇨🇳", symbol: "¥" },
    { code: "GBP", flag: "🇬🇧", symbol: "£" },
];

export default function CreateWalletModal({ visible, onClose, onSuccess }: CreateWalletModalProps) {
    const [selectedCurrency, setSelectedCurrency] = useState("USD");
    const [initialBalance, setInitialBalance] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            await axiosInstance.post("/wallets", {
                currency: selectedCurrency,
                initialBalance: Number(initialBalance) || 0,
            });

            setInitialBalance("");
            setSelectedCurrency("USD");
            onSuccess();
            onClose();
        } catch (error: any) {
            console.log(error);

            const errorMsg = error?.response?.data?.message || "지갑 등록에 실패했습니다.";
            if (Platform.OS === "web") {
                window.alert(errorMsg);
            } else {
                Alert.alert("알림", errorMsg);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            {/* 배경 오버레이: 웹/앱 모두 화면 전체 덮음 */}
            <View className="flex-1 justify-center items-center bg-black/40 px-6">
                {/* 💡 웹 대응: w-full에 max-w-[420px]를 주어 웹에서도 모바일 앱 비율의 컴팩트한 모달로 유지 */}
                <View className="bg-white w-full max-w-[420px] rounded-3xl p-6 shadow-xl">
                    <TextComponent className="text-xl font-bold text-text-primary mb-5 text-center">
                        외화 지갑 추가
                    </TextComponent>

                    {/* 통화 선택 */}
                    <TextComponent className="text-sm font-semibold text-text-secondary mb-2">
                        통화 선택
                    </TextComponent>
                    <View className="flex-row flex-wrap gap-2 mb-5">
                        {CURRENCY_OPTIONS.map(item => {
                            const isSelected = selectedCurrency === item.code;
                            return (
                                <TouchableOpacity
                                    key={item.code}
                                    onPress={() => setSelectedCurrency(item.code)}
                                    className={`flex-row items-center px-3.5 py-2.5 rounded-xl border ${
                                        isSelected
                                            ? "bg-primary-sub border-primary-main"
                                            : "bg-background border-border"
                                    }`}>
                                    <TextComponent className="text-base mr-1.5">
                                        {item.flag}
                                    </TextComponent>
                                    <TextComponent
                                        className={`text-sm font-bold ${
                                            isSelected ? "text-primary-dark" : "text-text-primary"
                                        }`}>
                                        {item.code}
                                    </TextComponent>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* 초기 잔액 입력 */}
                    <TextComponent className="text-sm font-semibold text-text-secondary mb-2">
                        초기 잔액 ({CURRENCY_OPTIONS.find(c => c.code === selectedCurrency)?.symbol}
                        )
                    </TextComponent>
                    <TextInput
                        value={initialBalance}
                        onChangeText={setInitialBalance}
                        placeholder="0"
                        placeholderTextColor="#86918C"
                        keyboardType="numeric"
                        className="bg-background border border-border rounded-xl px-4 py-3 text-base text-text-primary mb-6"
                    />

                    {/* 하단 버튼 */}
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={onClose}
                            className="flex-1 py-3.5 bg-disabled rounded-xl items-center justify-center">
                            <TextComponent className="text-text-secondary font-bold">
                                취소
                            </TextComponent>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleCreate}
                            disabled={isSubmitting}
                            className="flex-1 py-3.5 bg-primary-main rounded-xl items-center justify-center">
                            {isSubmitting ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <TextComponent className="text-white font-bold">
                                    등록하기
                                </TextComponent>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
