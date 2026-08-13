export type StyleColorType = "primary" | "success" | "warning" | "error" | "info";

export type StyleVariantType = "contained" | "outlined" | "text" | "icon";
export type StyleSizeType = "small" | "medium" | "large";
export type StyleShapeType = "rounded" | "circle";

export const BUTTON_SIZE_STYLE: Record<StyleSizeType, string> = {
    small: "px-3 py-1.5 min-h-[32px]",
    medium: "px-4 py-2 min-h-[44px]",
    large: "px-6 py-3 min-h-[52px]",
};
