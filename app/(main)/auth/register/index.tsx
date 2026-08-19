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

import { createUser } from "@/api/user/userApi";
import { RegisterUserInputType, registerUserSchema } from "@/schemas/user/registerUserSchema";

export default function RegisterScreen() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterUserInputType>({
        resolver: zodResolver(registerUserSchema),
        defaultValues: {
            email: "",
            nickname: "",
            phoneNumber: "",
            gender: undefined,
            birthdate: "",
            password: "",
            confirmPassword: "",
        },
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (data: RegisterUserInputType) => {
        console.log("🔥 회원가입 버튼 클릭");
        console.log("🔥 검증 성공:", data);

        try {
            setIsLoading(true);

            console.log("🔥 회원가입 API 요청 시작");

            const { confirmPassword, ...request } = data;

            const response = await createUser(request);

            console.log("🔥 회원가입 성공:", response);

            if (Platform.OS === "web") {
                window.alert("회원가입 완료\n성공적으로 회원가입 되었습니다.");
                router.replace("/");
            } else {
                Alert.alert(
                    "회원가입 완료",
                    "성공적으로 회원가입 되었습니다.",
                    [
                        {
                            text: "확인",
                            onPress: () => router.replace("/auth/login"),
                        },
                    ],
                    {
                        cancelable: false,
                    },
                );
            }
        } catch (error: any) {
            console.error("🔥 회원가입 오류:", error);

            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message;

                console.log("서버 응답:", status, message);

                if (status === 409) {
                    Alert.alert("회원가입 실패", message || "이미 사용 중인 정보입니다.");
                    return;
                }

                if (status === 400) {
                    Alert.alert("입력 오류", message || "입력한 정보를 확인해주세요.");
                    return;
                }

                Alert.alert("회원가입 실패", message || "회원가입 중 오류가 발생했습니다.");
                return;
            }

            Alert.alert(
                "서버 연결 오류",
                "서버에 연결할 수 없습니다.\n백엔드 서버가 실행 중인지 확인해주세요.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-bg-default"
            behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingBottom: 50,
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                <View className="px-[24px] pt-[36px]">
                    {/* 뒤로가기 */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center mb-6"
                        activeOpacity={0.7}>
                        <Feather name="chevron-left" size={26} color="#86918C" />
                    </TouchableOpacity>

                    {/* 타이틀 */}
                    <View className="mb-8">
                        <TextComponent className="text-[28px] font-bold text-text-primary">
                            회원가입
                        </TextComponent>

                        <TextComponent className="text-[14px] text-text-secondary mt-2">
                            여행과 자산을 한 곳에서 관리해보세요.
                        </TextComponent>
                    </View>

                    <View className="gap-5">
                        {/* 이메일 */}
                        <View>
                            <Label>이메일</Label>

                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, value } }) => (
                                    <View
                                        className={`h-[54px] rounded-2xl border bg-bg-paper px-4 flex-row items-center ${
                                            errors.email ? "border-error" : "border-divider"
                                        }`}>
                                        <Feather name="mail" size={19} color="#86918C" />

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

                        {/* 닉네임 */}
                        <View>
                            <Label>닉네임</Label>

                            <Controller
                                control={control}
                                name="nickname"
                                render={({ field: { onChange, value } }) => (
                                    <View
                                        className={`h-[54px] rounded-2xl border bg-bg-paper px-4 flex-row items-center ${
                                            errors.nickname ? "border-error" : "border-divider"
                                        }`}>
                                        <Feather name="user" size={19} color="#86918C" />

                                        <TextInput
                                            value={value}
                                            onChangeText={onChange}
                                            placeholder="닉네임을 입력해주세요"
                                            placeholderTextColor="#B7C1BE"
                                            autoCapitalize="none"
                                            className="flex-1 ml-3 text-[15px] text-text-primary"
                                        />
                                    </View>
                                )}
                            />

                            {errors.nickname && (
                                <ErrorMessage>{errors.nickname.message}</ErrorMessage>
                            )}
                        </View>

                        {/* 생년월일 */}
                        <View>
                            <Label>생년월일</Label>

                            <Controller
                                control={control}
                                name="birthdate"
                                render={({ field: { onChange, value } }) => (
                                    <View
                                        className={`h-[54px] rounded-2xl border bg-bg-paper px-4 flex-row items-center ${
                                            errors.birthdate ? "border-error" : "border-divider"
                                        }`}>
                                        <Feather name="calendar" size={19} color="#86918C" />

                                        <TextInput
                                            value={value}
                                            onChangeText={onChange}
                                            placeholder="YYYY-MM-DD"
                                            placeholderTextColor="#B7C1BE"
                                            keyboardType="numbers-and-punctuation"
                                            maxLength={10}
                                            className="flex-1 ml-3 text-[15px] text-text-primary"
                                        />
                                    </View>
                                )}
                            />

                            {errors.birthdate && (
                                <ErrorMessage>{errors.birthdate.message}</ErrorMessage>
                            )}
                        </View>

                        {/* 전화번호 */}
                        <View>
                            <Label>전화번호</Label>

                            <Controller
                                control={control}
                                name="phoneNumber"
                                render={({ field: { onChange, value } }) => (
                                    <View
                                        className={`h-[54px] rounded-2xl border bg-bg-paper px-4 flex-row items-center ${
                                            errors.phoneNumber ? "border-error" : "border-divider"
                                        }`}>
                                        <Feather name="phone" size={19} color="#86918C" />

                                        <TextInput
                                            value={value}
                                            onChangeText={onChange}
                                            placeholder="전화번호를 입력해주세요"
                                            placeholderTextColor="#B7C1BE"
                                            keyboardType="phone-pad"
                                            className="flex-1 ml-3 text-[15px] text-text-primary"
                                        />
                                    </View>
                                )}
                            />

                            {errors.phoneNumber && (
                                <ErrorMessage>{errors.phoneNumber.message}</ErrorMessage>
                            )}
                        </View>

                        {/* 비밀번호 */}
                        <View>
                            <Label>비밀번호</Label>

                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, value } }) => (
                                    <View
                                        className={`h-[54px] rounded-2xl border bg-bg-paper px-4 flex-row items-center ${
                                            errors.password ? "border-error" : "border-divider"
                                        }`}>
                                        <Feather name="lock" size={19} color="#86918C" />

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
                                                size={19}
                                                color="#86918C"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />

                            {errors.password && (
                                <ErrorMessage>{errors.password.message}</ErrorMessage>
                            )}
                        </View>

                        {/* 비밀번호 확인 */}
                        <View>
                            <Label>비밀번호 확인</Label>

                            <Controller
                                control={control}
                                name="confirmPassword"
                                render={({ field: { onChange, value } }) => (
                                    <View
                                        className={`h-[54px] rounded-2xl border bg-bg-paper px-4 flex-row items-center ${
                                            errors.confirmPassword
                                                ? "border-error"
                                                : "border-divider"
                                        }`}>
                                        <Feather name="lock" size={19} color="#86918C" />

                                        <TextInput
                                            value={value}
                                            onChangeText={onChange}
                                            placeholder="비밀번호를 다시 입력해주세요"
                                            placeholderTextColor="#B7C1BE"
                                            secureTextEntry={!showPasswordConfirm}
                                            autoCapitalize="none"
                                            className="flex-1 ml-3 text-[15px] text-text-primary"
                                        />

                                        <TouchableOpacity
                                            onPress={() => setShowPasswordConfirm(prev => !prev)}
                                            activeOpacity={0.7}>
                                            <Feather
                                                name={showPasswordConfirm ? "eye" : "eye-off"}
                                                size={19}
                                                color="#86918C"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />

                            {errors.confirmPassword && (
                                <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
                            )}
                        </View>

                        {/* 성별 */}
                        <View>
                            <Label>성별</Label>

                            <Controller
                                control={control}
                                name="gender"
                                render={({ field: { onChange, value } }) => (
                                    <View className="flex-row gap-3">
                                        {/* 남성 */}
                                        <TouchableOpacity
                                            onPress={() => onChange("MALE")}
                                            activeOpacity={0.8}
                                            className={`flex-1 h-[54px] rounded-2xl border items-center justify-center ${
                                                value === "MALE"
                                                    ? "border-primary-main bg-primary-main"
                                                    : errors.gender
                                                      ? "border-error bg-bg-paper"
                                                      : "border-divider bg-bg-paper"
                                            }`}>
                                            <TextComponent
                                                className={`text-[15px] font-semibold ${
                                                    value === "MALE"
                                                        ? "text-surface"
                                                        : "text-text-primary"
                                                }`}>
                                                남성
                                            </TextComponent>
                                        </TouchableOpacity>

                                        {/* 여성 */}
                                        <TouchableOpacity
                                            onPress={() => onChange("FEMALE")}
                                            activeOpacity={0.8}
                                            className={`flex-1 h-[54px] rounded-2xl border items-center justify-center ${
                                                value === "FEMALE"
                                                    ? "border-primary-main bg-primary-main"
                                                    : errors.gender
                                                      ? "border-error bg-bg-paper"
                                                      : "border-divider bg-bg-paper"
                                            }`}>
                                            <TextComponent
                                                className={`text-[15px] font-semibold ${
                                                    value === "FEMALE"
                                                        ? "text-surface"
                                                        : "text-text-primary"
                                                }`}>
                                                여성
                                            </TextComponent>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />

                            {errors.gender && <ErrorMessage>{errors.gender.message}</ErrorMessage>}
                        </View>
                    </View>

                    {/* 회원가입 버튼 */}
                    <View className="mt-8">
                        <Button
                            color="primary"
                            variant="contained"
                            size="large"
                            shape="rounded"
                            fullWidth
                            onPress={handleSubmit(handleRegister)}
                            disabled={isLoading}
                            className="h-[52px]">
                            {isLoading ? "가입 중..." : "회원가입"}
                        </Button>
                    </View>

                    {/* 로그인으로 이동 */}
                    <View className="flex-row justify-center items-center mt-6">
                        <TextComponent className="text-[13px] text-text-secondary">
                            이미 회원이신가요?
                        </TextComponent>

                        <TouchableOpacity
                            onPress={() => router.push("/auth/login")}
                            activeOpacity={0.7}>
                            <TextComponent className="text-[13px] font-bold text-primary-main ml-1">
                                로그인
                            </TextComponent>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
