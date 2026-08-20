import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";
import { twMerge } from "tailwind-merge";

type ShadowSize = "none" | "sm" | "md" | "lg";

interface CardProps extends ViewProps {
    children: React.ReactNode;
    shadow?: ShadowSize;
    className?: string;
}

const customShadows = StyleSheet.create({
    none: {},
    sm: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    md: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 5,
    },
    lg: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 8,
    },
});

export default function Card({ children, shadow = "sm", style, className, ...props }: CardProps) {
    return (
        <View
            style={[customShadows[shadow], style]}
            className={twMerge(
                "px-[25px] py-[20px] mb-[14px] rounded-[36px] bg-card",
                className,
            )}
            {...props}>
            {children}
        </View>
    );
}
