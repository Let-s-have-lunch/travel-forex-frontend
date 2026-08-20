import { ReactNode } from "react";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Feather } from "@expo/vector-icons";

import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";

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

export default function Title({
    title,
    showBackButton = false,
    onBackPress,
    description,
    children,
    className,
    leftIcon,
    textClassName,
    forceCenter = false,
}: Props) {
    const isCentered = showBackButton || forceCenter;

    return (
        <View
            className={twMerge(
                "w-full h-14 flex-row items-center justify-between px-[20px] bg-transparent relative",
                className,
            )}>
            {/* 왼쪽 영역 */}
            <View className="flex-row items-center flex-1 gap-2">
                {showBackButton && (
                    <Button
                        variant="text"
                        size="small"
                        shape="rounded"
                        onPress={onBackPress}
                        className="p-1"
                        textClassName="text-text-default">
                        {leftIcon ?? (
                            <Feather name="chevron-left" size={26} className="text-text-default" />
                        )}
                    </Button>
                )}

                {/* 좌측 정렬 타이틀 */}
                {!isCentered && (
                    <View className="flex-1 justify-center">
                        <TextComponent
                            className={twMerge(
                                "text-text-primary font-bold text-[22px]",
                                textClassName,
                            )}
                            numberOfLines={1}>
                            {title}
                        </TextComponent>

                        {description && (
                            <TextComponent
                                className="text-[12px] text-text-secondary mt-0.5"
                                numberOfLines={1}>
                                {description}
                            </TextComponent>
                        )}
                    </View>
                )}
            </View>

            {/* 오른쪽 영역 */}
            <View className="flex-row items-center shrink-0 pl-4 z-10">{children}</View>

            {/* 중앙 정렬 타이틀 */}
            {isCentered && (
                <View className="absolute left-[60px] right-[60px] top-0 bottom-0 justify-center items-center pointer-events-none">
                    <TextComponent
                        className={twMerge(
                            "text-text-primary font-bold text-[22px] text-center",
                            textClassName,
                        )}
                        numberOfLines={1}>
                        {title}
                    </TextComponent>

                    {description && (
                        <TextComponent
                            className="text-[12px] text-text-secondary mt-0.5 text-center"
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
