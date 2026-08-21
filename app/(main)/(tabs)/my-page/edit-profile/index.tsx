import { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Pressable,
    Platform,
    ScrollView,
    View,
    TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";

import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";
import InputGroup from "@/components/common/input/InputGroup";
import Title from "@/components/common/title/Title";

import { getMe, updateUser, withdrawUser } from "@/api/user/userApi";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import Input from "@/components/common/input/Input";

const profileSchema = z.object({
    nickname: z
        .string()
        .min(2, "닉네임은 2자 이상이어야 합니다.")
        .max(10, "닉네임은 10자 이하여야 합니다."),

    birthdate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "생년월일은 YYYY-MM-DD 형식으로 입력해주세요."),

    phoneNumber: z.string().min(1, "전화번호를 입력해주세요."),

    gender: z.enum(["MALE", "FEMALE"], {
        message: "성별을 선택해주세요.",
    }),
});

type ProfileFormType = z.infer<typeof profileSchema>;

export default function ProfileScreen() {
    const router = useRouter();

    const { user, setUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
    const [withdrawPassword, setWithdrawPassword] = useState("");
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormType>({
        resolver: zodResolver(profileSchema),
        mode: "onTouched",
        defaultValues: {
            nickname: "",
            birthdate: "",
            phoneNumber: "",
            gender: undefined,
        },
    });

    /**
     * ========================================
     * 최신 회원정보 조회
     * ========================================
     *
     * 프로필 관리 페이지에 진입하면
     * GET /users/me 요청
     *
     * 서버에서 최신 정보를 받아온 뒤
     * react-hook-form의 reset()으로 폼에 반영
     */
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setIsLoading(true);

                const response = await getMe();

                const user = response.data;

                reset({
                    nickname: user.nickname ?? "",
                    birthdate: user.birthdate ?? "",
                    phoneNumber: user.phoneNumber ?? "",
                    gender: user.gender,
                });
            } catch (error: any) {
                console.error("회원정보 조회 실패:", error);

                const status = error.response?.status;
                const message = error.response?.data?.message;

                if (status === 401) {
                    Alert.alert("로그인이 필요합니다.", "로그인 후 이용해주세요.", [
                        {
                            text: "확인",
                            onPress: () => router.replace("/auth/login"),
                        },
                    ]);
                    return;
                }

                Alert.alert("조회 실패", message || "회원정보를 불러오지 못했습니다.", [
                    {
                        text: "확인",
                        onPress: () => router.back(),
                    },
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [reset, router]);

    /**
     * ========================================
     * 회원정보 수정
     * ========================================
     */
    const handleUpdate = async (data: ProfileFormType) => {
        try {
            setIsSaving(true);

            const response = await updateUser(data);

            if (user) {
                setUser({
                    ...user,
                    ...data,
                });
            }

            console.log("수정완료");

            if (Platform.OS === "web") {
                window.alert(response.message || "회원정보가 성공적으로 수정되었습니다.");

                router.replace("/");
            } else {
                Alert.alert(
                    "수정 완료",
                    response.message || "회원정보가 성공적으로 수정되었습니다.",
                    [
                        {
                            text: "확인",
                            onPress: () => router.replace("/"),
                        },
                    ],
                );
            }
        } catch (error: any) {
            console.error("회원정보 수정 실패:", error);

            const status = error.response?.status;
            const message = error.response?.data?.message;

            if (status === 404) {
                Alert.alert("수정 실패", message || "해당 사용자를 찾을 수 없습니다.");
                return;
            }

            if (status === 409) {
                Alert.alert("수정 실패", message || "이미 사용 중인 닉네임 또는 전화번호입니다.");
                return;
            }

            if (status === 401) {
                Alert.alert("로그인이 필요합니다.", "로그인 정보가 만료되었습니다.", [
                    {
                        text: "확인",
                        onPress: () => router.replace("/auth/login"),
                    },
                ]);
                return;
            }

            Alert.alert("수정 실패", message || "회원정보 수정 중 오류가 발생했습니다.");
        } finally {
            setIsSaving(false);
        }
    };
    /**
     * ========================================
     * 회원 탈퇴
     * ========================================
     */
    const handleDeleteUser = () => {
        if (Platform.OS === "web") {
            const confirmed = window.confirm("정말 탈퇴하시겠습니까?");

            if (!confirmed) {
                return;
            }

            // 웹에서도 앱 Modal 열기
            setWithdrawPassword("");
            setIsWithdrawModalVisible(true);

            return;
        }

        Alert.alert("회원 탈퇴", "정말 탈퇴하시겠습니까?", [
            {
                text: "취소",
                style: "cancel",
            },
            {
                text: "확인",
                style: "destructive",
                onPress: () => {
                    setWithdrawPassword("");
                    setIsWithdrawModalVisible(true);
                },
            },
        ]);
    };

    const handleWithdraw = async (password: string) => {
        try {
            setIsWithdrawing(true);

            const response = await withdrawUser({
                password,
            });

            console.log("회원 탈퇴 성공:", response);

            useAuthStore.getState().logout();

            if (Platform.OS === "web") {
                window.alert(response.message || "회원 탈퇴가 성공적으로 처리되었습니다.");

                router.replace("/auth/login");
            } else {
                Alert.alert(
                    "탈퇴 완료",
                    response.message || "회원 탈퇴가 성공적으로 처리되었습니다.",
                    [
                        {
                            text: "확인",
                            onPress: () => router.replace("/auth/login"),
                        },
                    ],
                );
            }
        } catch (error: any) {
            console.error("회원 탈퇴 실패:", error);

            const status = error.response?.status;
            const message = error.response?.data?.message;

            if (Platform.OS === "web") {
                window.alert(message || "회원 탈퇴 중 오류가 발생했습니다.");
            } else {
                Alert.alert("탈퇴 실패", message || "회원 탈퇴 중 오류가 발생했습니다.");
            }
        } finally {
            setIsWithdrawing(false);
        }
    };
      
    /**
     * ========================================
     * 로딩 화면
     * ========================================
     */
    if (isLoading) {
        return (
            <View className="flex-1 bg-bg-default items-center justify-center">
                <TextComponent className="text-text-secondary">
                    회원정보를 불러오는 중...
                </TextComponent>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            className="flex-1"
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

                    {/* ========================================
                        타이틀
                    ======================================== */}

                    <Title
                        title="프로필 관리"
                        description="내 정보를 확인하고 수정해보세요."
                        className="h-auto px-0 items-start py-5 mb-8"
                        textClassName="text-[28px]"
                    />

                    <View>
                        {/* ========================================
                            이메일
                            - 서버에서 가져온 정보
                            - 수정 불가
                        ======================================== */}

                        <InputGroup label="이메일" size="small">
                            <View className="h-[48px] justify-center px-4 rounded-md bg-primary-sub">
                                <TextComponent className="text-text-secondary">
                                    {user?.email}
                                </TextComponent>
                            </View>
                        </InputGroup>

                        {/* ========================================
                            닉네임
                        ======================================== */}

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

                        {/* ========================================
                            생년월일
                        ======================================== */}

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

                        {/* ========================================
                            전화번호
                        ======================================== */}

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

                        {/* ========================================
                            성별
                        ======================================== */}

                        <InputGroup label="성별" size="small" errorMessage={errors.gender?.message}>
                            <Controller
                                control={control}
                                name="gender"
                                render={({ field: { onChange, value } }) => (
                                    <View className="flex-row gap-3">
                                        <Button
                                            variant={value === "MALE" ? "contained" : "outlined"}
                                            color="primary"
                                            size="medium"
                                            shape="rounded"
                                            wrap
                                            onPress={() => onChange("MALE")}>
                                            남성
                                        </Button>

                                        <Button
                                            variant={value === "FEMALE" ? "contained" : "outlined"}
                                            color="primary"
                                            size="medium"
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

                    {/* ========================================
                        저장 버튼
                    ======================================== */}

                    <View className="mt-2">
                        <Button
                            color="primary"
                            variant="contained"
                            size="medium"
                            shape="rounded"
                            fullWidth
                            onPress={handleSubmit(handleUpdate)}
                            disabled={isSaving}
                            className="h-[52px]">
                            {isSaving ? "수정 중..." : "수정사항 저장"}
                        </Button>
                    </View>

                    {/* ========================================
                        계정 관리
                    ======================================== */}

                    <View className="mt-10">
                        <TextComponent className="text-[15px] font-semibold text-text-primary mb-3">
                            계정 관리
                        </TextComponent>

                        {/* 비밀번호 변경 */}

                        <Button
                            variant="text"
                            color="primary"
                            size="medium"
                            onPress={() => router.push("/my-page/change-password")}
                            className="w-full px-0 py-4 border-b border-border">
                            <View className="flex-row items-center justify-between w-full">
                                <TextComponent className="text-[15px] text-text-primary">
                                    비밀번호 변경
                                </TextComponent>

                                <Feather name="chevron-right" size={20} color="#8A918E" />
                            </View>
                        </Button>

                        {/* 회원 탈퇴 */}

                        <Button
                            variant="text"
                            color="primary"
                            size="medium"
                            onPress={() => {
                                console.log("회원 탈퇴 버튼 눌림");
                                handleDeleteUser();
                            }}
                            className="w-full px-0 py-4">
                            <View className="flex-row items-center justify-between w-full">
                                <TextComponent className="text-[15px] text-error">
                                    회원 탈퇴
                                </TextComponent>

                                <Feather name="chevron-right" size={20} color="#8A918E" />
                            </View>
                        </Button>
                    </View>
                </View>
            </ScrollView>
            <Modal
                visible={isWithdrawModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => {
                    if (!isWithdrawing) {
                        setIsWithdrawModalVisible(false);
                        setWithdrawPassword("");
                    }
                }}>
                <View className="flex-1 bg-black/50 items-center justify-center px-6">
                    <View className="w-full rounded-2xl bg-surface p-6">
                        {/* 제목 */}
                        <TextComponent className="text-lg font-bold text-text-primary mb-2">
                            현재 비밀번호 입력
                        </TextComponent>

                        {/* 설명 */}
                        <TextComponent className="text-[12px] text-text-secondary mb-5">
                            회원 탈퇴를 위해 현재 비밀번호를 입력해주세요.
                        </TextComponent>

                        {/* 비밀번호 입력 */}
                        <InputGroup label="비밀번호" size="small" className="mb-5">
                            <Input
                                value={withdrawPassword}
                                onChangeText={setWithdrawPassword}
                                placeholder="현재 비밀번호를 입력해주세요"
                                secureTextEntry
                                editable={!isWithdrawing}
                                size="small"
                            />
                        </InputGroup>

                        {/* 버튼 */}
                        <View className="flex-row gap-3">
                            {/* 취소 */}
                            <Button
                                variant="outlined"
                                color="primary"
                                size="medium"
                                shape="rounded"
                                wrap
                                disabled={isWithdrawing}
                                onPress={() => {
                                    setIsWithdrawModalVisible(false);
                                    setWithdrawPassword("");
                                }}
                                className="h-[52px] border-divider">
                                취소
                            </Button>

                            {/* 탈퇴하기 */}
                            <Button
                                variant="contained"
                                color="primary"
                                size="medium"
                                shape="rounded"
                                wrap
                                disabled={isWithdrawing}
                                onPress={() => handleWithdraw(withdrawPassword)}
                                className="h-[52px] bg-error">
                                {isWithdrawing ? "탈퇴 중..." : "탈퇴하기"}
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}
