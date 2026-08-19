import { Slot } from "expo-router";
import "../styles/global.css";
import { useThemeStore } from "../stores/theme/useThemeStore";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthProvider from "@/components/domain/auth/AuthProvider";

export default function RootLayout() {
    const { theme } = useThemeStore();

    // 앱에서 라이트모드와 다크모드를 적용하기 위한 기능을 호출
    const { setColorScheme } = useColorScheme();

    useEffect(() => {
        setColorScheme(theme);
    }, [theme, setColorScheme]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <StatusBar style={theme === "dark" ? "light" : "dark"} />

                <SafeAreaView className="flex-1">
                    <AuthProvider>
                        <View className="flex-1">
                            <Slot />
                        </View>
                    </AuthProvider>
                </SafeAreaView>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
