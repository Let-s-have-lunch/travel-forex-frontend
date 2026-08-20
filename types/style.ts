export type StyleColorType = "primary" | "success" | "warning" | "error" | "info";
export type StyleVariantType = "contained" | "outlined" | "text" | "icon";
export type StyleSizeType = "small" | "medium" | "large";
export type StyleShapeType = "rounded" | "circle";

export const BUTTON_SIZE_STYLE: Record<StyleSizeType, string> = {
    small: "px-3 py-1.5",
    medium: "px-4 py-2",
    large: "px-6 py-3",
};

export const INPUT_SIZE_STYLE = {
    mini: "text-xs px-1 py-1",
    small: "text-sm px-4 py-4",
    medium: "text-lg px-5 py-5",
    large: "text-xl px-8 py-8",
};
