import { ExpenseCategory } from "@/types/tripExpense";

export const CATEGORY_INFO: Record<
    ExpenseCategory,
    { label: string; icon: string; color: string }
> = {
    FOOD: { label: "식비", icon: "life-buoy", color: "#F97316" },
    TRANSPORT: { label: "교통", icon: "map-pin", color: "#10B981" },
    SHOPPING: { label: "쇼핑", icon: "shopping-bag", color: "#14B8A6" },
    OTHER: { label: "기타", icon: "box", color: "#A16207" },
};
