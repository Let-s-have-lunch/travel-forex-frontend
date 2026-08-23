import { View, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";

function PublicIndex() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
            <View className="flex-1 justify-center items-center px-6">
                <Image
                    source={require("@/assets/images/public/landing_illust.png")}
                    style={{ width: "100%", height: 240 }}
                    resizeMode="contain"
                    className="mb-8"
                />

                <TextComponent className="text-[22px] font-bold text-center text-text-primary leading-tight mb-4">
                    여행을 더 특별하게,{"\n"}지출을 더 스마트하게
                </TextComponent>

                <TextComponent className="text-[14px] text-center text-text-secondary leading-relaxed mb-4">
                    외화 지갑, 환율, 여행 일정과{"\n"}지출까지 한 번에 관리하세요.
                </TextComponent>
            </View>

            <View className="px-6 pb-10 w-full gap-y-3">
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    className="py-4 rounded-xl shadow-sm"
                    onPress={() => router.push("/(public)/auth/login")}>
                    로그인
                </Button>

                <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    fullWidth
                    className="py-4 rounded-xl bg-white"
                    onPress={() => router.push("/(public)/auth/register")}>
                    회원가입
                </Button>
            </View>
        </SafeAreaView>
    );
}

export default PublicIndex;
