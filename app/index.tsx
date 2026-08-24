import { useAuthStore } from "@/stores/auth/useAuthStore";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";

function RootIndex() {
    const { isLoggedIn, isInitialized } = useAuthStore();

    if (!isInitialized) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#6BC1B6" />
            </View>
        );
    }

    if (isLoggedIn) {
        return <Redirect href="/(main)/(tabs)/(home)" />;
    } else {
        return <Redirect href="/(public)" />;
    }
}

export default RootIndex;
