import { TouchableOpacity, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Feather } from "@expo/vector-icons";
import { ReactNode } from "react";
import TextComponent from "@/components/common/text/TextComponent";

interface Props {
    title?: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
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
            <View className="flex-row items-center flex-1 gap-2">
                {showBackButton && (
                    <TouchableOpacity
                        onPress={onBackPress}
                        className={"py-2 justify-center"}
                        activeOpacity={0.7}>
                        {leftIcon ?? (
                            <Feather name="chevron-left" size={28} className="text-text-primary" />
                        )}
                    </TouchableOpacity>
                )}

                <View className="flex-row items-center shrink-0 pl-4 z-10">{children}</View>

                {isCentered && (
                    <View
                        className={twMerge(
                            ["absolute"],
                            ["left-[60px] right-[60px]"],
                            ["top-0 bottom-0"],
                            ["justify-center items-center"],
                            ["pointer-events-none"],
                        )}>
                        <TextComponent
                            className={twMerge(
                                "text-text-primary font-bold text-[18px] text-center",
                                textClassName,
                            )}
                            numberOfLines={1}>
                            {title}
                        </TextComponent>
                    </View>
                )}
            </View>
        </View>
    );
}
