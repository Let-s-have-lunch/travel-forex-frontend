import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Slot } from "expo-router";
import { useLayoutStore } from "@/stores/layout/useLayoutStore";
import MainFooter from "@/components/layout/main/MainFooter";

function MainLayout() {
    const { showMainFooter } = useLayoutStore();

    return (

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

            {showMainFooter && (
                <View className="w-full">
                    <MainFooter />
                </View>
            )}
        </View>
    );
}

export default MainLayout;