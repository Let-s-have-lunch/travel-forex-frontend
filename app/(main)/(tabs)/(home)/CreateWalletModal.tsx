import { useEffect } from "react";
import {
    View,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    Alert,
    Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import axiosInstance from "@/api/axiosInstance";
import TextComponent from "@/components/common/text/TextComponent";
import Input from "@/components/common/input/Input";

interface CreateWalletModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface WalletFormData {
    currency: string;
    initialBalance: string;
}

const CURRENCY_OPTIONS = [
    { code: "USD", flag: "🇺🇸", symbol: "$" },
    { code: "JPY", flag: "🇯🇵", symbol: "¥" },
    { code: "EUR", flag: "🇪🇺", symbol: "€" },
    { code: "CNY", flag: "🇨🇳", symbol: "¥" },
    { code: "GBP", flag: "🇬🇧", symbol: "£" },
];

export default function CreateWalletModal({ visible, onClose, onSuccess }: CreateWalletModalProps) {
    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { isSubmitting },
    } = useForm<WalletFormData>({
        defaultValues: {
            currency: "USD",
            initialBalance: "",
        },
    });

    const selectedCurrency = watch("currency");

    useEffect(() => {
        if (!visible) {
            reset();
        }
    }, [visible, reset]);

    const onSubmit = async (data: WalletFormData) => {
        try {
            await axiosInstance.post("/wallets", {
                currency: data.currency,
                initialBalance: Number(data.initialBalance) || 0,
            });

            reset();
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);

            const errorMsg = error?.response?.data?.message || "지갑 등록에 실패했습니다.";
            if (Platform.OS === "web") {
                window.alert(errorMsg);
            } else {
                Alert.alert("알림", errorMsg);
            }
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
            {/* 배경 오버레이 */}
            <View className="flex-1 justify-center items-center bg-black/40 px-6">
                <View className="bg-white w-full max-w-[420px] rounded-3xl p-6 shadow-xl">
                    <TextComponent className="text-xl font-bold text-text-primary mb-5 text-center">
                        외화 지갑 추가
                    </TextComponent>

                    {/* 통화 선택 */}
                    <TextComponent className="text-sm font-semibold text-text-secondary mb-2">
                        통화 선택
                    </TextComponent>
                    <Controller
                        control={control}
                        name="currency"
                        render={({ field: { value, onChange } }) => (
                            <View className="flex-row flex-wrap gap-2 mb-5">
                                {CURRENCY_OPTIONS.map(item => {
                                    const isSelected = value === item.code;
                                    return (
                                        <TouchableOpacity
                                            key={item.code}
                                            onPress={() => onChange(item.code)}
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
                        )}
                    />

                    {/* 초기 잔액 입력 */}
                    <TextComponent className="text-sm font-semibold text-text-secondary mb-2">
                        초기 잔액 ({CURRENCY_OPTIONS.find(c => c.code === selectedCurrency)?.symbol})
                    </TextComponent>
                    <Controller
                        control={control}
                        name="initialBalance"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View className="mb-6">
                                <Input
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholder="0"
                                    placeholderTextColor="#86918C"
                                    keyboardType="numeric"
                                />
                            </View>
                        )}
                    />

                    {/* 하단 버튼 */}
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={handleClose}
                            className="flex-1 py-3.5 bg-disabled rounded-xl items-center justify-center">
                            <TextComponent className="text-text-secondary font-bold">
                                취소
                            </TextComponent>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleSubmit(onSubmit)}
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