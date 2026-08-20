import React, { useState } from "react";
import {
    View,
    TextInput,
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
import Label from "@/components/common/label/Label";
import ErrorMessage from "@/components/common/label/ErrorMessage";
import Button from "@/components/common/button/Button";

import { loginUser } from "@/api/user/userApi";
import { LoginUserInputType, loginUserSchema } from "@/schemas/user/loginUserSchema";
import { useAuthStore } from "@/stores/auth/useAuthStore";

export default function LoginScreen() {
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
        defaultValues: {
            email: "",
            password: "",
        },
    });

    /* ========================================
       로그인 성공
    ======================================== */

    const handleLogin = async (data: LoginUserInputType) => {
        console.log("① 로그인 버튼 클릭");
        console.log("② Zod 검증 성공");

        try {
            setIsLoading(true);

            console.log("③ 로그인 API 요청 시작");

            const response = await loginUser(data);

            if (response?.user && response?.token) {
                login(response.user, response.token);
                console.log("✅ Zustand 로그인 저장 완료!");
            } else {
                console.warn("⚠️ user 또는 token이 응답에 없습니다:", response);
            }

            console.log("④ 로그인 API 응답 성공");
            console.log("로그인 응답:", response);

            console.log("⑤ 홈 화면으로 이동");

            router.replace("/");
        } catch (error: any) {
            console.error("❌ 로그인 오류:", error);

            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message;

                console.log("❌ 서버 상태 코드:", status);
                console.log("❌ 서버 응답:", error.response.data);

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
                <View className="flex-1 px-[24px] pt-[28px]">
                    {/* ========================================
                        뒤로가기
                    ======================================== */}

                    <TouchableOpacity
                        className="w-[40px] h-[40px] items-center justify-center"
                        activeOpacity={0.7}
                        onPress={() => router.back()}>
                        <Feather name="chevron-left" size={30} color="#3F4643" />
                    </TouchableOpacity>

                    {/* ========================================
                        제목
                    ======================================== */}

                    <View className="mt-8">
                        <TextComponent className="text-[32px] font-bold text-text-primary">
                            로그인
                        </TextComponent>

                        <TextComponent className="mt-2 text-[15px] text-text-secondary">
                            여행을 더 스마트하게 관리해보세요.
                        </TextComponent>
                    </View>

                    {/* ========================================
                        입력 영역
                    ======================================== */}

                    <View className="mt-12 gap-6">
                        {/* 이메일 */}
                        <View>
                            <Label>이메일</Label>

                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, value } }) => (
                                    <View
                                        className={`h-[58px] rounded-2xl border bg-bg-paper px-4 flex-row items-center ${
                                            errors.email ? "border-error" : "border-divider"
                                        }`}>
                                        <Feather name="mail" size={19} color="#A18F8F" />

                                        <TextInput
                                            value={value}
                                            onChangeText={onChange}
                                            placeholder="이메일을 입력해주세요"
                                            placeholderTextColor="#B7C1BE"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            className="flex-1 ml-3 text-[15px] text-text-primary"
                                        />
                                    </View>
                                )}
                            />

                            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                        </View>

                        {/* 비밀번호 */}
                        <View>
                            <Label>비밀번호</Label>

                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, value } }) => (
                                    <View
                                        className={`h-[58px] rounded-2xl border bg-bg-paper px-4 flex-row items-center ${
                                            errors.password ? "border-error" : "border-divider"
                                        }`}>
                                        <Feather name="lock" size={19} color="#A18F8F" />

                                        <TextInput
                                            value={value}
                                            onChangeText={onChange}
                                            placeholder="비밀번호를 입력해주세요"
                                            placeholderTextColor="#B7C1BE"
                                            secureTextEntry={!showPassword}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            className="flex-1 ml-3 text-[15px] text-text-primary"
                                        />

                                        <TouchableOpacity
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

                            {errors.password && (
                                <ErrorMessage>{errors.password.message}</ErrorMessage>
                            )}

                            {/* 비밀번호 찾기 */}
                            <TouchableOpacity
                                className="items-end mt-3"
                                activeOpacity={0.7}
                                onPress={() => console.log("비밀번호 찾기")}>
                                <TextComponent className="text-[13px] text-text-secondary">
                                    비밀번호를 잊으셨나요?
                                </TextComponent>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* ========================================
                        로그인 버튼
                    ======================================== */}

                    <View className="mt-10">
                        <Button
                            color="primary"
                            variant="contained"
                            size="large"
                            shape="rounded"
                            fullWidth
                            onPress={handleSubmit(handleLogin, handleLoginError)}
                            disabled={isLoading}
                            className="h-[58px] rounded-2xl">
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

                    {/* ========================================
                        구분선
                    ======================================== */}

                    <View className="flex-row items-center mt-10">
                        <View className="flex-1 h-[1px] bg-divider" />

                        <TextComponent className="mx-5 text-[13px] text-text-secondary">
                            또는
                        </TextComponent>

                        <View className="flex-1 h-[1px] bg-divider" />
                    </View>

                    {/* ========================================
                        게스트 둘러보기
                    ======================================== */}

                    <View className="mt-8">
                        <Button
                            color="primary"
                            variant="outlined"
                            size="large"
                            shape="rounded"
                            fullWidth
                            onPress={() => {
                                console.log("게스트로 둘러보기");
                                router.replace("/");
                            }}
                            className="h-[58px] rounded-2xl">
                            게스트로 둘러보기
                        </Button>
                    </View>

                    {/* 하단 여백 */}
                    <View className="flex-1" />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
