import React from "react";
import { View, ViewProps } from "react-native";
import { twMerge } from "tailwind-merge";

type ShadowSize = "none" | "sm" | "md" | "lg";

interface CardProps extends ViewProps {
    children: React.ReactNode;
    shadow?: ShadowSize;
    className?: string;
}

export default function Card({ children, shadow = "sm", style, className, ...props }: CardProps) {
    const shadowClass = shadow === "none" ? "shadow-none" : `shadow-${shadow}`;

    return (
        <View
            style={style}
            className={twMerge(
                ["px-[25px]", "py-[20px]", "mb-[14px]"],
                ["rounded-[36px]"],
                ["bg-card"],
                shadowClass,
                className,
            )}
            {...props}>
            {children}
        </View>
    );
}
