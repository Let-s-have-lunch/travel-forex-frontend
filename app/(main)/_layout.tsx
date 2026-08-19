import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Slot } from "expo-router";
import { useLayoutStore } from "@/stores/layout/useLayoutStore";
import MainFooter from "@/components/layout/main/MainFooter";

export default function MainLayout() {
    const { showMainFooter } = useLayoutStore();

    return (
        /* 바깥쪽 전체 배경 판 */
        <View className="flex-1 w-full items-center bg-background">
            <View
                className={twMerge([
                    "flex-1",
                    "w-full",
                    "max-w-6xl",
                    "px-6 pt-6",
                    "self-center",
                    "bg-background",
                ])}>
                <Slot />
            </View>

            {/* 푸터도 헤더 기준과 동일하게 lg:hidden으로 맞춤 */}
            {showMainFooter && (
                <View className="w-full">
                    <MainFooter />
                </View>
            )}
        </View>
    );
}
