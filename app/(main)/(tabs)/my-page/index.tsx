import { Feather } from "@expo/vector-icons";
import { Pressable, ScrollView, Switch, View } from "react-native";
import { useRouter } from "expo-router";

import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";
import { useAuthStore } from "@/stores/auth/useAuthStore";

export default function MyPage() {
    const router = useRouter();

    const { user, isLoggedIn } = useAuthStore();

    const handleLogin = () => {
        router.push("/auth/login");
    };

    const handleMenuPress = (menu: string) => {
        if (!isLoggedIn) {
            router.push("/auth/login");
            return;
        }

        switch (menu) {
            case "profile":
                router.push("/my-page");
                break;

            case "password":
                router.push("/my-page");
                break;

            case "notification":
                router.push("/my-page");
                break;

            case "inquiry":
                router.push("/my-page");
                break;

            case "announcement":
                router.push("/my-page");
                break;

            case "logout":
                // logout 처리
                break;
        }
    };

    return (
        <View className="flex-1 ">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 120,
                }}>
                {/* 페이지 제목 */}
                <View className="px-6 pt-6 pb-5">
                    <TextComponent className="text-xl font-bold text-text-default">
                        마이페이지
                    </TextComponent>
                </View>

                {/* ========================= */}
                {/* 프로필 영역 */}
                {/* ========================= */}

                {isLoggedIn ? (
                    <View className="mx-5 mb-6 rounded-3xl bg-white">
                        <View className="flex-row items-center">
                            {/* 프로필 이미지 */}
                            <View className="h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-secondary-main">
                                <TextComponent className="text-3xl">🧳</TextComponent>
                            </View>

                            {/* 사용자 정보 */}
                            <View className="ml-4 flex-1">
                                <TextComponent className="text-lg font-bold text-primary-main">
                                    {user?.nickname ?? "여행자님"}
                                </TextComponent>

                                <TextComponent className="mt-1 text-xs text-gray-500">
                                    {user?.email ?? "travel@example.com"}
                                </TextComponent>
                            </View>
                        </View>
                    </View>
                ) : (
                    <Pressable
                        onPress={handleLogin}
                        className="mx-5 mb-6 flex-row items-center rounded-3xl bg-primary-main px-5 py-5">
                        {/* 로그인 아이콘 */}
                        <View className="h-14 w-14 items-center justify-center rounded-full bg-white/70">
                            <Feather name="user" size={24} color="#6FA89E" />
                        </View>

                        {/* 로그인 안내 */}
                        <View className="ml-4 flex-1">
                            <TextComponent className="text-base font-bold text-white">
                                로그인이 필요해요
                            </TextComponent>

                            {/*<TextComponent className="mt-1 text-xs text-white/80">*/}
                            {/*    로그인하고 여행 기록을 관리해보세요*/}
                            {/*</TextComponent>*/}
                        </View>

                        <Feather name="chevron-right" size={22} color="#FFFFFF" />
                    </Pressable>
                )}

                {/* ========================= */}
                {/* 회원 관리 */}
                {/* ========================= */}

                <MenuSection title="회원관리">
                    <MenuItem
                        icon="user"
                        title="프로필 관리"
                        onPress={() => handleMenuPress("profile")}
                    />

                    <MenuItem
                        icon="lock"
                        title="비밀번호 수정"
                        onPress={() => handleMenuPress("password")}
                    />

                </MenuSection>

                {/* ========================= */}
                {/* 고객센터 */}
                {/* ========================= */}

                <MenuSection title="고객센터">
                    <MenuItem
                        icon="help-circle"
                        title="1:1 문의"
                        onPress={() => handleMenuPress("inquiry")}
                    />

                    <MenuItem
                        icon="message-circle"
                        title="공지사항"
                        onPress={() => handleMenuPress("announcement")}
                    />
                </MenuSection>
                
            </ScrollView>
        </View>
    );
}

/* ========================================
   메뉴 섹션
======================================== */

interface MenuSectionProps {
    title: string;
    children: React.ReactNode;
}

function MenuSection({ title, children }: MenuSectionProps) {
    return (
        <View className="px-6">
            <TextComponent className="mb-2 mt-4 text-sm font-bold text-gray-500">
                {title}
            </TextComponent>

            <View>{children}</View>
        </View>
    );
}

/* ========================================
   메뉴 아이템
======================================== */

interface MenuItemProps {
    icon: keyof typeof Feather.glyphMap;
    title: string;
    onPress: () => void;
}

function MenuItem({ icon, title, onPress }: MenuItemProps) {
    return (
        <Pressable onPress={onPress} className="flex-row items-center py-4">
            {/* 아이콘 */}
            <View className="w-8 items-center">
                <Feather name={icon} size={21} color="#777777" />
            </View>

            {/* 텍스트 */}
            <TextComponent className="ml-3 flex-1 text-sm text-text-default">{title}</TextComponent>

            {/* 화살표 */}
            <Feather name="chevron-right" size={20} color="#999999" />
        </Pressable>
    );
}
