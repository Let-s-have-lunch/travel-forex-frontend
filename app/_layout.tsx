import { Redirect, Slot, useSegments } from "expo-router";
import "../styles/global.css";
import { useThemeStore } from "../stores/theme/useThemeStore";
import { useColorScheme } from "nativewind";
import { ActivityIndicator, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthProvider from "@/components/domain/auth/AuthProvider";
import { useAuthStore } from "@/stores/auth/useAuthStore";

export default function RootLayout() {
    const { theme } = useThemeStore();
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    const isInitialized = useAuthStore(state => state.isInitialized);

    const segments = useSegments()

    const { setColorScheme } = useColorScheme();

    useEffect(() => {
        setColorScheme(theme);
    }, [theme, setColorScheme]);

    const inPublicGroup = segments[0] === "(public)";

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <StatusBar style={theme === "dark" ? "light" : "dark"} />
                <SafeAreaView className="flex-1 bg-white">
                    <AuthProvider>
                        <View className="flex-1 relative">
                            {isInitialized && isLoggedIn && inPublicGroup && (
                                <Redirect href="/(main)/(tabs)/(home)" />
                            )}
                            {isInitialized && !isLoggedIn && !inPublicGroup && (
                                <Redirect href="/(public)" />
                            )}
                            <Slot />

                            {!isInitialized && (
                                <View className="absolute inset-0 flex-1 justify-center items-center bg-white z-50">
                                    <ActivityIndicator size="large" color="#6BC1B6" />
                                </View>
                            )}
                        </View>
                    </AuthProvider>
                </SafeAreaView>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
