import { TextProps, Text } from "react-native";
import { twMerge } from "tailwind-merge";
import { StyleSizeType } from "@/types/style";

interface ErrorMessageProps extends TextProps {
    size?: StyleSizeType;
}

function ErrorMessage({ size = "medium", className, children, ...props }: ErrorMessageProps) {
    const ERROR_SIZE_STYLES = {
        mini: "text-[10px] mt-0.5",
        small: "text-[10px] mt-0.5",
        medium: "text-xs mt-1",
        large: "text-sm mt-2",
    };

    return (
        <Text
            className={twMerge("text-error ml-0.5", ERROR_SIZE_STYLES[size], className)}
            {...props}>
            {children}
        </Text>
    );
}

export default ErrorMessage;
