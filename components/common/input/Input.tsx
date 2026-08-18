import { TextInputProps, View } from "react-native";
import { StyleSizeType } from "@/types/style";

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
    ...props
               }: InputProps) {
    return (
        <View>

        </View>
    )
}