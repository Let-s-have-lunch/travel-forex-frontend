import React from "react";
import { View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import TextComponent from "@/components/common/text/TextComponent";
import Card from "@/components/common/card/Card";

export default function SelectTypePage() {
    const router = useRouter();

    const handleSelectType = (type: "DEPOSIT" | "WITHDRAW") => {
        router.push({
            pathname: "/(main)/(tabs)/(home)/create-transaction" as any,
            params: { type },
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
            <StatusBar style="dark" />

            <View className="flex-1 px-6 pb-8 max-w-[600px] w-full self-center">
                {/* 상단 헤더 (타이틀 중앙 정렬 수정) */}
                <View className="w-full py-4 relative items-center justify-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute left-0 top-3 w-10 h-10 items-start justify-center z-10">
                        <TextComponent className="text-2xl font-bold text-text-primary">
                            ‹
                        </TextComponent>
                    </TouchableOpacity>

                    <View className="items-center justify-center">
                        <TextComponent className="text-lg font-bold text-text-primary text-center">
                            거래 유형 선택
                        </TextComponent>
                        <TextComponent className="text-xs text-text-secondary text-center mt-1">
                            추가할 거래 유형을 선택해주세요.
                        </TextComponent>
                    </View>
                </View>

                {/* 카드 영역 */}
                <View className="flex-1 flex-col gap-5 mt-4">
                    {/* 1. 입금 카드 */}
                    <TouchableOpacity
                        className="flex-1"
                        activeOpacity={0.85}
                        onPress={() => handleSelectType("DEPOSIT")}>
                        <Card
                            className="w-full h-full bg-card border border-border rounded-3xl justify-center items-center p-6"
                            shadow="none">
                            <View className="w-16 h-16 rounded-full bg-primary-sub items-center justify-center mb-4">
                                <TextComponent className="text-2xl text-primary-main font-bold">
                                    ↓
                                </TextComponent>
                            </View>
                            <TextComponent className="text-xl font-bold text-text-primary mb-2">
                                입금
                            </TextComponent>
                            <TextComponent className="text-xs text-text-tertiary text-center leading-5">
                                외화 지갑으로 돈을{"\n"}입금한 내역을 기록합니다.
                            </TextComponent>
                        </Card>
                    </TouchableOpacity>

                    {/* 2. 출금 카드 */}
                    <TouchableOpacity
                        className="flex-1"
                        activeOpacity={0.85}
                        onPress={() => handleSelectType("WITHDRAW")}>
                        <Card
                            className="w-full h-full bg-card border border-border rounded-3xl justify-center items-center p-6"
                            shadow="none">
                            <View className="w-16 h-16 rounded-full bg-primary-sub items-center justify-center mb-4">
                                <TextComponent className="text-2xl text-primary-main font-bold">
                                    ↑
                                </TextComponent>
                            </View>
                            <TextComponent className="text-xl font-bold text-text-primary mb-2">
                                출금
                            </TextComponent>
                            <TextComponent className="text-xs text-text-tertiary text-center leading-5">
                                외화 지갑에서 돈을{"\n"}출금한 내역을 기록합니다.
                            </TextComponent>
                        </Card>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
