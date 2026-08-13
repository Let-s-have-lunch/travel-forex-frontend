import { Pressable, PressableProps, Text } from "react-native";
import {
    BUTTON_SIZE_STYLE,
    StyleColorType,
    StyleSizeType,
    StyleShapeType,
    StyleVariantType,
} from "@/types/style";
import { twMerge } from "tailwind-merge";

interface Props extends PressableProps {
    color?: StyleColorType;
    variant?: StyleVariantType;
    size?: StyleSizeType;
    shape?: StyleShapeType;
    wrap?: boolean;
    textClassName?: string;
    fullWidth?: boolean;
    className?: string;
}

function Button({
    color = "primary",
    variant = "contained",
    size = "medium",
    shape = "rounded",
    fullWidth = false,
    wrap = false,
    textClassName,
    className,
    children,
    ...props
}: Props) {
    const getColorKey = () => {
        if (color === "primary") return "primary-main";
        return color;
    };

    const colorKey = getColorKey();

    // 버튼 외형 및 배경/테두리 색상 결정
    const getVariantClasses = () => {
        switch (variant) {
            case "contained":
                return `bg-${colorKey}`;
            case "outlined":
                return `border border-${colorKey} bg-transparent`;
            case "text":
                return `bg-transparent`;
            case "icon":
                return `bg-${colorKey}`;
        }
    };

    // 버튼 텍스트 및 아이콘 색상 결정 (Contrast 처리)
    const getTextColorClasses = () => {
        if (variant === "contained" || variant === "icon") {
            return `text-surface`;
        }
        return `text-${colorKey}`;
    };

    // 모서리 형태 결정 (네모 vs 동그라미)
    const getShapeClasses = () => {
        if (shape === "circle") return "rounded-full aspect-square p-2";
        return "rounded-md";
    };

    return (
        <Pressable
            className={twMerge(
                "flex flex-row justify-center items-center gap-1.5 font-bold",
                getShapeClasses(),
                BUTTON_SIZE_STYLE[size],
                getVariantClasses(),
                fullWidth && shape !== "circle" ? "w-full" : "",
                wrap && "flex-1",
                className,
            )}
            {...props}>
            {/* children이 텍스트일 경우 Text 컴포넌트로 감싸고, 아이콘 등 ReactNode일 경우 그대로 렌더링 */}
            {typeof children === "string" ? (
                <Text
                    className={twMerge(
                        "font-bold",
                        getTextColorClasses(),
                        size === "small" ? "text-xs" : size === "large" ? "text-base" : "text-sm",
                        textClassName
                    )}>
                    {children}
                </Text>
            ) : (
                children
            )}
        </Pressable>
    );
}

export default Button;
