import React, { useState } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";


export default function LoginScreen() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        // TODO: 로그인 API 연결
        console.log("로그인", {
            email,
            password,
        });
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
                <View className="flex-1 px-[24px] pt-[36px]">
                    {/* 뒤로가기 */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center mb-6"
                        activeOpacity={0.7}>
                        <Feather name="chevron-left" size={26} color="#444444" />
                    </TouchableOpacity>

                    {/* 타이틀 */}
                    <View className="mb-10">
                        <TextComponent className="text-[28px] font-bold text-text-default">
                            로그인
                        </TextComponent>

                        <TextComponent className="text-[14px] text-text-secondary mt-2">
                            여행을 더 스마트하게 관리해보세요.
                        </TextComponent>
                    </View>

                    {/* 로그인 폼 */}
                    <View className="gap-5">
                        {/* 이메일 */}
                        <View>
                            <TextComponent className="text-[14px] font-semibold text-text-default mb-2">
                                이메일
                            </TextComponent>

                            <View className="h-[54px] rounded-2xl border border-divider bg-bg-paper px-4 flex-row items-center">
                                <Feather name="mail" size={19} color="#A18F8F" />

                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="이메일을 입력해주세요"
                                    placeholderTextColor="#BDBDBD"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    className="flex-1 ml-3 text-[15px] text-text-default"
                                />
                            </View>
                        </View>

                        {/* 비밀번호 */}
                        <View>
                            <TextComponent className="text-[14px] font-semibold text-text-default mb-2">
                                비밀번호
                            </TextComponent>

                            <View className="h-[54px] rounded-2xl border border-divider bg-bg-paper px-4 flex-row items-center">
                                <Feather name="lock" size={19} color="#A18F8F" />

                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="비밀번호를 입력해주세요"
                                    placeholderTextColor="#BDBDBD"
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    className="flex-1 ml-3 text-[15px] text-text-default"
                                />

                                <TouchableOpacity
                                    onPress={() => setShowPassword(prev => !prev)}
                                    activeOpacity={0.7}>
                                    <Feather
                                        name={showPassword ? "eye" : "eye-off"}
                                        size={19}
                                        color="#A18F8F"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* 비밀번호 찾기 */}
                    <View className="items-end mt-3">
                        <TouchableOpacity
                            activeOpacity={0.7}>
                            <TextComponent className="text-[13px] text-text-secondary">
                                비밀번호를 잊으셨나요?
                            </TextComponent>
                        </TouchableOpacity>
                    </View>

                    {/* 로그인 버튼 */}
                    <View className="mt-8">
                        <Button
                            fullWidth
                            size="medium"
                            color="primary"
                            onPress={handleLogin}>
                            로그인
                        </Button>
                    </View>

                    {/* 회원가입 */}
                    <View className="flex-row justify-center items-center mt-6">
                        <TextComponent className="text-[13px] text-text-secondary">
                            아직 회원이 아니신가요?
                        </TextComponent>

                        <TouchableOpacity
                            onPress={() => router.push("/auth/register")}
                            activeOpacity={0.7}>
                            <TextComponent className="text-[13px] font-bold text-primary-main ml-1">
                                회원가입
                            </TextComponent>
                        </TouchableOpacity>
                    </View>

                    {/* 구분선 */}
                    <View className="flex-row items-center my-8">
                        <View className="flex-1 h-[1px] bg-divider" />

                        <TextComponent className="text-[12px] text-text-secondary mx-4">
                            또는
                        </TextComponent>

                        <View className="flex-1 h-[1px] bg-divider" />
                    </View>

                    {/* 둘러보기 */}
                    <TouchableOpacity
                        onPress={() => router.replace("/")}
                        className="h-[52px] rounded-2xl border border-divider bg-bg-paper items-center justify-center"
                        activeOpacity={0.7}>
                        <TextComponent className="text-[14px] font-medium text-text-default">
                            게스트로 둘러보기
                        </TextComponent>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
