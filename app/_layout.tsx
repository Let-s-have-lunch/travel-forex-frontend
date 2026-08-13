import { Slot } from "expo-router";
import "../styles/global.css";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import { useEffect } from "react";

export default function RootLayout() {
    const { theme } = useThemeStore();

    // 앱에서 라이트모드와 다크모드를 적용하기 위한 기능을 호출
    const { setColorScheme } = useColorScheme();

    useEffect(() => {
        setColorScheme(theme);
    }, [theme, setColorScheme]);

    return (
        <View className={theme}>
            <Slot />
        </View>
    );
}
