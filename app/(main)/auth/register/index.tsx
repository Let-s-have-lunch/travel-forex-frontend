import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";
import Input from "@/components/common/input/Input";
import InputGroup from "@/components/common/input/InputGroup";
import Title from "@/components/common/title/Title";
import { createUser } from "@/api/user/userApi";
import { RegisterUserInputType, registerUserSchema } from "@/schemas/user/registerUserSchema";

export default function RegisterScreen() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerUserSchema),
        mode: "onTouched"
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
        try {
            setIsLoading(true);

            const { confirmPassword, ...request } = data;

            const response = await createUser(request);

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

                    {/* 타이틀 */}
                    <Title
                        title="회원가입"
                        description="여행과 자산을 한 곳에서 관리해보세요."
                        className="h-auto px-0 items-start py-5 mb-8"
                        textClassName="text-[28px]"
                    />

                    <View>
                        {/* 이메일 */}
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="이메일"
                                    size="small"
                                    errorMessage={errors.email?.message}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    onBlur={onBlur}
                                    autoCorrect={false}
                                    placeholder="이메일을 입력해주세요"
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )}
                        />

                        {/* 닉네임 */}
                        <Controller
                            control={control}
                            name="nickname"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="닉네임"
                                    size="small"
                                    errorMessage={errors.nickname?.message}
                                    autoCapitalize="none"
                                    onBlur={onBlur}
                                    placeholder="닉네임을 입력해주세요"
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )}
                        />

                        {/* 생년월일 */}
                        <Controller
                            control={control}
                            name="birthdate"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="생년월일"
                                    size="small"
                                    errorMessage={errors.birthdate?.message}
                                    placeholder="YYYY-MM-DD"
                                    keyboardType="numbers-and-punctuation"
                                    onBlur={onBlur}
                                    maxLength={10}
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )}
                        />

                        {/* 전화번호 */}
                        <Controller
                            control={control}
                            name="phoneNumber"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="전화번호"
                                    size="small"
                                    errorMessage={errors.phoneNumber?.message}
                                    placeholder="전화번호를 입력해주세요"
                                    keyboardType="phone-pad"
                                    onBlur={onBlur}
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )}
                        />

                        {/* 비밀번호 */}
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="비밀번호"
                                    size="small"
                                    onBlur={onBlur}
                                    errorMessage={errors.password?.message}>
                                    <View className="relative">
                                        <Input
                                            value={value}
                                            onChangeText={onChange}
                                            placeholder="비밀번호를 입력해주세요"
                                            secureTextEntry={!showPassword}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            hasError={!!errors.password}
                                            className="pr-10"
                                        />

                                        <View className="absolute right-4 top-0 bottom-0 justify-center">
                                            <Feather
                                                name={showPassword ? "eye" : "eye-off"}
                                                size={19}
                                                className="text-text-secondary"
                                                onPress={() => setShowPassword(prev => !prev)}
                                            />
                                        </View>
                                    </View>
                                </InputGroup>
                            )}
                        />

                        {/* 비밀번호 확인 */}
                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="비밀번호 확인"
                                    size="small"
                                    onBlur={onBlur}
                                    errorMessage={errors.confirmPassword?.message}>
                                    <View className="relative">
                                        <Input
                                            value={value}
                                            onChangeText={onChange}
                                            placeholder="비밀번호를 다시 입력해주세요"
                                            secureTextEntry={!showPasswordConfirm}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            hasError={!!errors.confirmPassword}
                                            className="pr-10"
                                        />

                                        <View className="absolute right-4 top-0 bottom-0 justify-center">
                                            <Feather
                                                name={showPasswordConfirm ? "eye" : "eye-off"}
                                                size={19}
                                                className="text-text-secondary"
                                                onPress={() =>
                                                    setShowPasswordConfirm(prev => !prev)
                                                }
                                            />
                                        </View>
                                    </View>
                                </InputGroup>
                            )}
                        />

                        {/* 성별 */}
                        <InputGroup label="성별" size="small" errorMessage={errors.gender?.message}>
                            <Controller
                                control={control}
                                name="gender"
                                render={({ field: { onChange, value } }) => (
                                    <View className="flex-row gap-3">
                                        <Button
                                            variant={value === "MALE" ? "contained" : "outlined"}
                                            color="primary"
                                            size="large"
                                            shape="rounded"
                                            wrap
                                            onPress={() => onChange("MALE")}>
                                            남성
                                        </Button>

                                        <Button
                                            variant={value === "FEMALE" ? "contained" : "outlined"}
                                            color="primary"
                                            size="large"
                                            shape="rounded"
                                            wrap
                                            onPress={() => onChange("FEMALE")}>
                                            여성
                                        </Button>
                                    </View>
                                )}
                            />
                        </InputGroup>
                    </View>

                    {/* 회원가입 버튼 */}
                    <View className="mt-5">
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

                        <Button
                            variant="text"
                            color="primary"
                            size="small"
                            onPress={() => router.push("/auth/login")}
                            className="p-0 ml-1"
                            textClassName="text-[13px]">
                            로그인
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
