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

export default function RegisterScreen() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const handleRegister = () => {
        // TODO: 회원가입 API 연결
        console.log("회원가입", {
            email,
            nickname,
            password,
            passwordConfirm,
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
                    <View className="mb-8">
                        <TextComponent className="text-[28px] font-bold text-text-default">
                            회원가입
                        </TextComponent>

                        <TextComponent className="text-[14px] text-text-secondary mt-2">
                            여행과 자산을 한 곳에서 관리해보세요.
                        </TextComponent>
                    </View>

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

                        {/* 닉네임 */}
                        <View>
                            <TextComponent className="text-[14px] font-semibold text-text-default mb-2">
                                닉네임
                            </TextComponent>

                            <View className="h-[54px] rounded-2xl border border-divider bg-bg-paper px-4 flex-row items-center">
                                <Feather name="user" size={19} color="#A18F8F" />

                                <TextInput
                                    value={nickname}
                                    onChangeText={setNickname}
                                    placeholder="닉네임을 입력해주세요"
                                    placeholderTextColor="#BDBDBD"
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
                                    className="flex-1 ml-3 text-[15px] text-text-default"
                                />

                                <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
                                    <Feather
                                        name={showPassword ? "eye" : "eye-off"}
                                        size={19}
                                        color="#A18F8F"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* 비밀번호 확인 */}
                        <View>
                            <TextComponent className="text-[14px] font-semibold text-text-default mb-2">
                                비밀번호 확인
                            </TextComponent>

                            <View className="h-[54px] rounded-2xl border border-divider bg-bg-paper px-4 flex-row items-center">
                                <Feather name="lock" size={19} color="#A18F8F" />

                                <TextInput
                                    value={passwordConfirm}
                                    onChangeText={setPasswordConfirm}
                                    placeholder="비밀번호를 다시 입력해주세요"
                                    placeholderTextColor="#BDBDBD"
                                    secureTextEntry={!showPasswordConfirm}
                                    autoCapitalize="none"
                                    className="flex-1 ml-3 text-[15px] text-text-default"
                                />

                                <TouchableOpacity
                                    onPress={() => setShowPasswordConfirm(prev => !prev)}>
                                    <Feather
                                        name={showPasswordConfirm ? "eye" : "eye-off"}
                                        size={19}
                                        color="#A18F8F"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* 회원가입 버튼 */}
                    <View className="mt-8">
                        <Button fullWidth size="medium" color="primary" onPress={handleRegister}>
                            회원가입
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
