import { TextInputProps, View } from "react-native";
import { StyleSizeType } from "@/types/style";
import { twMerge } from "tailwind-merge";
import Label from "@/components/common/label/Label";
import Input from "@/components/common/input/Input";
import ErrorMessage from "@/components/common/label/ErrorMessage";

interface InputGroupProps extends TextInputProps {
    label?: string;
    errorMessage?: string;
    wrap?: boolean;
    size?: StyleSizeType;
}

function InputGroup({
    label,
    errorMessage,
    wrap,
    className,
    size = "small",
    children,
    ...props
}: InputGroupProps) {
    return (
        <View className={twMerge("w-full mb-5", wrap && "flex-1", "gap-1.5", className)}>
            {label && <Label size={size}>{label}</Label>}
            {children ? children : <Input hasError={!!errorMessage} size={size} {...props} />}
            {errorMessage && <ErrorMessage size={size}>{errorMessage}</ErrorMessage>}
        </View>
    );
}

export default InputGroup;