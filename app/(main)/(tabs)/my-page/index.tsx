import { Feather } from "@expo/vector-icons";
import { Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import TextComponent from "@/components/common/text/TextComponent";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import Title from "@/components/common/title/Title";

export default function MyPage() {
    const router = useRouter();

    const { user, isLoggedIn, logout } = useAuthStore();

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
                router.push("/my-page/edit-profile");
                break;

            case "password":
                router.push("/my-page/change-password");
                break;

            case "inquiry":
                router.push("/my-page/inquiries");
                break;

            case "notice":
                router.push("/my-page/notice");
                break;

            case "logout":
                logout();
                break;
        }
    };

    return (
        <View className="flex-1">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 120,
                }}>
                {/*<View className="px-5 pt-7 pb-8">*/}
                {/*    <Title*/}
                {/*        title="마이페이지"*/}
                {/*        className="h-auto px-0"*/}
                {/*        textClassName="text-[28px]"*/}
                {/*    />*/}
                {/*</View>*/}

                {isLoggedIn ? (
                    <View className="mx-5 mb-6 rounded-md bg-white px-4 py-6">
                        <View className="flex-row items-center">
                            {/* 사용자 정보 */}
                            <View className="ml-4">
                                <View className={"flex-row items-center"}>
                                <TextComponent className="text-lg font-bold text-primary-main">
                                    {user?.nickname ?? "여행자"}님
                                </TextComponent>

                                <TextComponent className="mt-1 text-sm font-bold text-primary-main">
                                    {" "}어디로 떠나볼까요?
                                </TextComponent>
                                </View>

                                <TextComponent className="mt-1 text-xs text-text-tertiary">
                                    {user?.email ?? "travel@example.com"}
                                </TextComponent>


                            </View>
                        </View>
                    </View>
                ) : (
                    <Pressable
                        onPress={handleLogin}
                        className="mx-5 mb-6 flex-row items-center rounded-md bg-primary-main px-5 py-5">
                        {/* 로그인 아이콘 */}
                        <View className="h-14 w-14 items-center justify-center rounded-full bg-white/70">
                            <Feather name="user" size={24} color="#6FA89E" />
                        </View>

                        {/* 로그인 안내 */}
                        <View className="ml-4 flex-1">
                            <TextComponent className="text-base font-bold text-white">
                                로그인이 필요해요
                            </TextComponent>

                            <TextComponent className="mt-1 text-xs text-white/80">
                                로그인하고 여행 기록을 관리해보세요
                            </TextComponent>
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
                        onPress={() => handleMenuPress("notice")}
                    />
                </MenuSection>

                {/* ========================= */}
                {/* 기타 */}
                {/* ========================= */}

                <MenuSection title="기타">
                    <MenuItem
                        icon="log-out"
                        title={isLoggedIn ? "로그아웃" : "로그인"}
                        onPress={() => {
                            if (isLoggedIn) {
                                handleMenuPress("logout");
                            } else {
                                handleLogin();
                            }
                        }}
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
            <TextComponent className="mb-2 mt-4 text-sm font-bold text-text-secondary">
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
                <Feather name={icon} size={21} className={"text-text-tertiary"} />
            </View>

            {/* 텍스트 */}
            <TextComponent className="ml-3 flex-1 text-sm text-text-secondary">{title}</TextComponent>

            {/* 화살표 */}
            <Feather name="chevron-right" size={20} className={"text-text-tertiary"} />
        </Pressable>
    );
}
