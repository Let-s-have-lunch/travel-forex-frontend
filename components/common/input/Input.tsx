import { TextInput, TextInputProps, View } from "react-native";
import { INPUT_SIZE_STYLE, StyleSizeType } from "@/types/style";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

interface InputProps extends TextInputProps {
    hasError?: boolean;
    size?: StyleSizeType;
    hideBorder?: boolean;
}

function Input({
    hasError,
    size = "small",
    className,
    placeholderClassName,
    hideBorder,
    onFocus,
    onBlur,
    ...props
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View
            className={twMerge(
                ["w-full", "flex-row"],
                ["items-center"],
                ["rounded-md"],
                ["bg-bg-paper"],
                !hideBorder && "border",
                !hideBorder &&
                    (hasError
                        ? "border-accent-coral"
                        : isFocused
                          ? "border-primary-main"
                          : "border-divider"),
            )}>
            <TextInput
                className={twMerge(
                    "flex-1 text-text-primary outline-none",
                    INPUT_SIZE_STYLE[size],
                    className,
                )}
                placeholderClassName={placeholderClassName}
                placeholderTextColor="#B7C1BE"
                {...props}
                onFocus={event => {
                    setIsFocused(true);
                    onFocus?.(event);
                }}
                onBlur={event => {
                    setIsFocused(false);
                    onBlur?.(event);
                }}
            />
        </View>
    );
}

export default Input;
