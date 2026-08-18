import { View, ViewProps } from "react-native";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import { StyleColorType, StyleSizeType } from "@/types/style";

interface BadgeProps extends ViewProps {
    color?: StyleColorType;
    size?: StyleSizeType;
    textClass?: string;
}

function Badge({
    color = "primary",
    size = "small",
    textClass,
    className,
    children,
    ...props
}: BadgeProps) {

    const getBgColorClasses = (color: StyleColorType) => {
        return `bg-${color}-main border border-${color}-main`;
    };

    const CONTAINER_SIZE_STYLES = {
        small: "px-3 py-1",
        medium: "px-3.5 py-1.5",
        large: "px-4 py-2",
    };

    const TEXT_SIZE_STYLES = {
        small: "text-xs",
        medium: "text-sm",
        large: "text-base",
    };

    return (
        <View
            className={twMerge(
                "rounded-full flex-row items-center justify-center",
                getBgColorClasses(color),
                CONTAINER_SIZE_STYLES[size],
                className,
            )}
            {...props}>
            {typeof children === "string" ? (
                <TextComponent
                    className={twMerge("font-bold text-white", TEXT_SIZE_STYLES[size], textClass)}>
                    {children}
                </TextComponent>
            ) : (
                children
            )}
        </View>
    );
}

export default Badge;
