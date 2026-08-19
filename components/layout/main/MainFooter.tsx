import TextComponent from "@/components/common/text/TextComponent";
import { Platform, TouchableOpacity, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Href, usePathname, useRouter } from "expo-router";
import { USER_NAV_LIST } from "@/constants/menu";
import { useThemeStore } from "@/stores/theme/useThemeStore";

interface Props {
    className?: string;
}

export default function MainFooter({ className }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();
    const { theme } = useThemeStore();
    const isDark = theme === "dark";

    // 디자인 시스템 컬러 토큰 매핑
    const activeColor = isDark ? "#5ab0a6" : "#6bc1b6"; // primary-main
    const inactiveColor = isDark ? "#657068" : "#86918c"; // text-tertiary / text-disabled

    return (
        <View
            className={twMerge(
                "w-full bg-surface border-t border-border justify-center items-center px-[20px]",
                className,
            )}
            style={{
                paddingBottom: Platform.OS === "ios" ? Math.max(insets.bottom, 10) : 10,
                paddingTop: 10,
            }}>
            <View className="w-full max-w-4xl flex-row items-center justify-around">
                {USER_NAV_LIST.map(tab => {
                    const isActive =
                        tab.path === "/" ? pathname === "/" : pathname.startsWith(tab.path);

                    const currentColor = isActive ? activeColor : inactiveColor;
                    const { iconComponent: IconComponent, iconName } = tab;

                    return (
                        <TouchableOpacity
                            key={tab.path}
                            onPress={() => router.push(tab.path as Href)}
                            activeOpacity={0.7}
                            className="items-center justify-center py-1 gap-1 flex-1">
                            <IconComponent name={iconName as any} size={24} color={currentColor} />
                            <TextComponent
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                minimumFontScale={0.8}
                                style={{
                                    color: currentColor,
                                    fontSize: 11,
                                    fontWeight: isActive ? "700" : "500",
                                    marginTop: 2,
                                }}>
                                {tab.name}
                            </TextComponent>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}
