import { useState } from "react";
import {
    View,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import TextComponent from "@/components/common/text/TextComponent";
import InputGroup from "@/components/common/input/InputGroup";
import Input from "@/components/common/input/Input";
import Button from "@/components/common/button/Button";

import { loginUser } from "@/api/user/userApi";
import { LoginUserInputType, loginUserSchema } from "@/schemas/user/loginUserSchema";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import Title from "@/components/common/title/Title";

function LoginScreen() {
    const { login } = useAuthStore();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginUserInputType>({
        resolver: zodResolver(loginUserSchema),
        mode: "onBlur",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    /* ========================================
       로그인 성공
    ======================================== */

    const handleLogin = async (data: LoginUserInputType) => {
        try {
            setIsLoading(true);

            const response = await loginUser(data);

            if (response?.user && response?.token) {
                login(response.user, response.token);
            } else {
                console.warn("⚠️ user 또는 token이 응답에 없습니다:", response);
            }

            router.replace("/");
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message;

                if (status === 401) {
                    Alert.alert(
                        "로그인 실패",
                        message || "이메일 또는 비밀번호가 올바르지 않습니다.",
                    );
                    return;
                }

                if (status === 400) {
                    Alert.alert("입력 오류", message || "입력한 정보를 확인해주세요.");
                    return;
                }

                Alert.alert("로그인 실패", message || "로그인 중 오류가 발생했습니다.");

                return;
            }

            if (error.request) {
                Alert.alert(
                    "서버 연결 오류",
                    "백엔드 서버에 연결할 수 없습니다.\n백엔드 서버가 실행 중인지 확인해주세요.",
                );

                return;
            }

            Alert.alert("오류", "로그인 처리 중 문제가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    /* ========================================
       Zod 검증 실패
    ======================================== */

    const handleLoginError = (formErrors: typeof errors) => {
        console.log("❌ Zod 검증 실패:", formErrors);
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-bg-default"
            behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: 40,
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                <View className="flex-1 px-[20px] pt-[28px]">
                    {/* ========================================
                        뒤로가기
                    ======================================== */}

                    <Button
                        variant="icon"
                        color="primary"
                        size="small"
                        shape="circle"
                        onPress={() => router.back()}
                        className="w-[30px] h-[40px] p-0 bg-[#F1F3F2]">
                        <Feather name="chevron-left" size={26} color="#3F4643" />
                    </Button>

                    {/* ========================================
                        제목
                    ======================================== */}

                    <View className="mt-5">
                        <Title
                            title="로그인"
                            description="여행을 더 스마트하게 관리해보세요."
                            className="h-auto px-0 items-start"
                            textClassName="text-[28px]"
                        />
                    </View>

                    {/* ========================================
                        입력 영역
                    ======================================== */}

                    <View className="mt-12">
                        {/* 이메일 */}
                        <InputGroup
                            label="이메일"
                            errorMessage={errors.email?.message}
                            size="small">
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        placeholder="이메일을 입력해주세요"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        autoComplete="off"
                                        textContentType="none"
                                        hasError={!!errors.email}
                                    />
                                )}
                            />
                        </InputGroup>

                        {/* 비밀번호 */}
                        <InputGroup
                            label="비밀번호"
                            errorMessage={errors.password?.message}
                            size="small">
                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View className="relative">
                                        <Input
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            placeholder="비밀번호를 입력해주세요"
                                            secureTextEntry={!showPassword}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            hasError={!!errors.password}
                                            className="pr-12"
                                        />

                                        <TouchableOpacity
                                            className="absolute right-4 top-0 bottom-0 justify-center"
                                            onPress={() => setShowPassword(prev => !prev)}
                                            activeOpacity={0.7}>
                                            <Feather
                                                name={showPassword ? "eye" : "eye-off"}
                                                size={20}
                                                color="#A18F8F"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />

                            {/* 비밀번호 찾기 */}
                            <TouchableOpacity
                                className="items-end mt-1"
                                activeOpacity={0.7}
                                onPress={() => console.log("비밀번호 찾기")}>
                                <TextComponent className="text-[13px] text-text-secondary">
                                    비밀번호를 잊으셨나요?
                                </TextComponent>
                            </TouchableOpacity>
                        </InputGroup>
                    </View>

                    {/* ========================================
                        로그인 버튼
                    ======================================== */}

                    <View className="mt-5">
                        <Button
                            color="primary"
                            variant="contained"
                            size="large"
                            shape="rounded"
                            fullWidth
                            onPress={handleSubmit(handleLogin, handleLoginError)}
                            disabled={isLoading}
                            className="h-[58px]">
                            {isLoading ? "로그인 중..." : "로그인"}
                        </Button>
                    </View>

                    {/* ========================================
                        회원가입
                    ======================================== */}

                    <View className="flex-row justify-center items-center mt-6">
                        <TextComponent className="text-[14px] text-text-secondary">
                            아직 회원이 아니신가요?
                        </TextComponent>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => router.push("/auth/register")}>
                            <TextComponent className="ml-1 text-[14px] font-semibold text-primary-main">
                                회원가입
                            </TextComponent>
                        </TouchableOpacity>
                    </View>

                    {/* 하단 여백 */}
                    <View className="flex-1" />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default LoginScreen;
