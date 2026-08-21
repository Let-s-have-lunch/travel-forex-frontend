import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/common/button/Button";
import Input from "@/components/common/input/Input";
import InputGroup from "@/components/common/input/InputGroup";
import Title from "@/components/common/title/Title";

import { updatePassword } from "@/api/user/userApi";
import { UpdatePasswordInputType, updatePasswordSchema } from "@/schemas/user/changePasswordSchema";


export default function ChangePasswordScreen() {
    const router = useRouter();

    const [showPrevPassword, setShowPrevPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<UpdatePasswordInputType>({
        resolver: zodResolver(updatePasswordSchema),
        mode: "onTouched",
        defaultValues: {
            prevPassword: "",
            password: "",
            confirmPassword: "",
        },
    });

    /**
     * ========================================
     * 비밀번호 변경
     * ========================================
     */
    const handleChangePassword = async (
        data: UpdatePasswordInputType,
    ) => {
        try {
            setIsSaving(true);

            const response = await updatePassword(data);

            const successMessage =
                response.message ||
                "비밀번호가 성공적으로 변경되었습니다.";

            // 웹
            if (Platform.OS === "web") {
                window.alert(successMessage);
                router.replace("/my-page");
                return;
            }

            // 모바일
            Alert.alert(
                "비밀번호 변경 완료",
                successMessage,
                [
                    {
                        text: "확인",
                        onPress: () => router.replace("/my-page"),
                    },
                ],
                {
                    cancelable: false,
                },
            );
        } catch (error: any) {
            console.error("비밀번호 변경 실패:", error);

            const status = error.response?.status;
            const message = error.response?.data?.message;

            /**
             * 현재 비밀번호 불일치
             */
            if (status === 400) {
                setError("prevPassword", {
                    type: "server",
                    message:
                        message ||
                        "현재 비밀번호가 일치하지 않습니다.",
                });

                return;
            }

            /**
             * 로그인 만료
             */
            if (status === 401) {
                if (Platform.OS === "web") {
                    window.alert(
                        "로그인이 만료되었습니다. 다시 로그인해주세요.",
                    );

                    router.replace("/auth/login");
                } else {
                    Alert.alert(
                        "로그인이 필요합니다.",
                        "로그인이 만료되었습니다. 다시 로그인해주세요.",
                        [
                            {
                                text: "확인",
                                onPress: () =>
                                    router.replace("/auth/login"),
                            },
                        ],
                    );
                }

                return;
            }

            /**
             * 그 외 서버 오류
             */
            if (Platform.OS === "web") {
                window.alert(
                    message ||
                    "비밀번호 변경 중 오류가 발생했습니다.",
                );
            } else {
                Alert.alert(
                    "변경 실패",
                    message ||
                    "비밀번호 변경 중 오류가 발생했습니다.",
                );
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-bg-default"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingBottom: 50,
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
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
                        className="w-[30px] h-[40px] p-0 bg-[#F1F3F2]"
                    >
                        <Feather
                            name="chevron-left"
                            size={26}
                            color="#3F4643"
                        />
                    </Button>

                    {/* ========================================
                        타이틀
                    ======================================== */}

                    <Title
                        title="비밀번호 변경"
                        description="안전한 계정 관리를 위해 비밀번호를 변경해주세요."
                        className="h-auto px-0 items-start py-5 mb-8"
                        textClassName="text-[28px]"
                    />

                    <View>

                        {/* ========================================
                            현재 비밀번호
                        ======================================== */}

                        <Controller
                            control={control}
                            name="prevPassword"
                            render={({
                                         field: {
                                             onChange,
                                             onBlur,
                                             value,
                                         },
                                     }) => (
                                <InputGroup
                                    label="현재 비밀번호"
                                    size="small"
                                    errorMessage={
                                        errors.prevPassword?.message
                                    }
                                >
                                    <View className="relative">
                                        <Input
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            placeholder="현재 비밀번호를 입력해주세요"
                                            secureTextEntry={
                                                !showPrevPassword
                                            }
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            hasError={
                                                !!errors.prevPassword
                                            }
                                            className="pr-12"
                                        />

                                        <View className="absolute right-4 top-0 bottom-0 justify-center">
                                            <Feather
                                                name={
                                                    showPrevPassword
                                                        ? "eye"
                                                        : "eye-off"
                                                }
                                                size={19}
                                                color="#8A918E"
                                                onPress={() =>
                                                    setShowPrevPassword(
                                                        prev => !prev,
                                                    )
                                                }
                                            />
                                        </View>
                                    </View>
                                </InputGroup>
                            )}
                        />

                        {/* ========================================
                            새 비밀번호
                        ======================================== */}

                        <Controller
                            control={control}
                            name="password"
                            render={({
                                         field: {
                                             onChange,
                                             onBlur,
                                             value,
                                         },
                                     }) => (
                                <InputGroup
                                    label="새 비밀번호"
                                    size="small"
                                    errorMessage={
                                        errors.password?.message
                                    }
                                >
                                    <View className="relative">
                                        <Input
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            placeholder="새 비밀번호를 입력해주세요"
                                            secureTextEntry={
                                                !showPassword
                                            }
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            hasError={
                                                !!errors.password
                                            }
                                            className="pr-12"
                                        />

                                        <View className="absolute right-4 top-0 bottom-0 justify-center">
                                            <Feather
                                                name={
                                                    showPassword
                                                        ? "eye"
                                                        : "eye-off"
                                                }
                                                size={19}
                                                color="#8A918E"
                                                onPress={() =>
                                                    setShowPassword(
                                                        prev => !prev,
                                                    )
                                                }
                                            />
                                        </View>
                                    </View>
                                </InputGroup>
                            )}
                        />

                        {/* ========================================
                            새 비밀번호 확인
                        ======================================== */}

                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({
                                         field: {
                                             onChange,
                                             onBlur,
                                             value,
                                         },
                                     }) => (
                                <InputGroup
                                    label="새 비밀번호 확인"
                                    size="small"
                                    errorMessage={
                                        errors.confirmPassword?.message
                                    }
                                >
                                    <View className="relative">
                                        <Input
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            placeholder="새 비밀번호를 다시 입력해주세요"
                                            secureTextEntry={
                                                !showConfirmPassword
                                            }
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            hasError={
                                                !!errors.confirmPassword
                                            }
                                            className="pr-12"
                                        />

                                        <View className="absolute right-4 top-0 bottom-0 justify-center">
                                            <Feather
                                                name={
                                                    showConfirmPassword
                                                        ? "eye"
                                                        : "eye-off"
                                                }
                                                size={19}
                                                color="#8A918E"
                                                onPress={() =>
                                                    setShowConfirmPassword(
                                                        prev => !prev,
                                                    )
                                                }
                                            />
                                        </View>
                                    </View>
                                </InputGroup>
                            )}
                        />

                    </View>

                    {/* ========================================
                        변경 버튼
                    ======================================== */}

                    <View className="mt-5">
                        <Button
                            color="primary"
                            variant="contained"
                            size="large"
                            shape="rounded"
                            fullWidth
                            onPress={handleSubmit(
                                handleChangePassword,
                            )}
                            disabled={isSaving}
                            className="h-[52px]"
                        >
                            {isSaving
                                ? "변경 중..."
                                : "변경하기"}
                        </Button>
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}