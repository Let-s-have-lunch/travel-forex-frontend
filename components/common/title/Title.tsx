import { ReactNode } from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import Button from "@/components/common/button/Button";
import TextComponent from "@/components/common/text/TextComponent";


interface Props {
    title?: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    description?: string;
    children?: ReactNode;
    className?: string;
    textClassName?: string;
    forceCenter?: boolean;
    leftIcon?: ReactNode;
}

function Title({
    title,
    showBackButton = false,
    onBackPress,
    description,
    children,
    className,
    textClassName,
    forceCenter = false,
    leftIcon,
}: Props) {
    const isCentered = showBackButton || forceCenter;

    return (
        <View
            className={twMerge(
                "w-full h-14 flex-row items-center justify-between px-5 bg-transparent relative",
                className,
            )}>
            {/* 왼쪽 영역 */}
            <View className="flex-row items-center flex-1 gap-2 z-10">
                {showBackButton && (
                    <Button
                        variant="text"
                        size="small"
                        shape="rounded"
                        onPress={onBackPress}
                        className="p-1 -ml-1"
                        accessibilityLabel="뒤로가기">
                        {leftIcon ?? <Feather name="chevron-left" size={26} color="#0F172A" />}
                    </Button>
                )}

                {/* 좌측 정렬 타이틀 */}
                {!isCentered && (
                    <View className="flex-1 justify-center">
                        {title && (
                            <TextComponent
                                className={twMerge(
                                    "text-slate-900 font-bold text-[22px]",
                                    textClassName,
                                )}
                                numberOfLines={1}>
                                {title}
                            </TextComponent>
                        )}

                        {description && (
                            <TextComponent
                                className="text-[12px] text-slate-500 mt-0.5"
                                numberOfLines={1}>
                                {description}
                            </TextComponent>
                        )}
                    </View>
                )}
            </View>

            {/* 오른쪽 영역 */}
            {children && (
                <View className="flex-row items-center shrink-0 pl-4 z-10">{children}</View>
            )}

            {/* 중앙 정렬 타이틀 */}
            {isCentered && (
                <View
                    pointerEvents="none"
                    className="absolute left-[60px] right-[60px] top-0 bottom-0 justify-center items-center">
                    {title && (
                        <TextComponent
                            className={twMerge(
                                "text-slate-900 font-bold text-[20px] text-center",
                                textClassName,
                            )}
                            numberOfLines={1}>
                            {title}
                        </TextComponent>
                    )}

                    {description && (
                        <TextComponent
                            className="text-[12px] text-slate-500 mt-0.5 text-center"
                            numberOfLines={1}>
                            {description}
                        </TextComponent>
                    )}
                </View>
            )}
        </View>
    );
}

export default Title;
