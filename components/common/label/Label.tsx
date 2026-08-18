import { TextProps } from "react-native";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import { StyleSizeType } from "@/types/style";

interface LabelProps extends TextProps {
    size?: StyleSizeType;
}

function Label({ size = "medium", className, children, ...props }: LabelProps) {
    const LABEL_SIZE_STYLES = {
        mini: "text-sm mb-1",
        small: "text-sm mb-1",
        medium: "text-lg mb-1.5",
        large: "text-xl mb-2",
    };
    return (
        <TextComponent
            className={twMerge(
                "font-semibold ml-1 text-text-primary",
                LABEL_SIZE_STYLES[size],
                className,
            )}
            {...props}>
            {children}
        </TextComponent>
    );
}

export default Label;
