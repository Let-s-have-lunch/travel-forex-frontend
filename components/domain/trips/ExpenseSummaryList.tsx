import React from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Card from "@/components/common/card/Card";
import TextComponent from "@/components/common/text/TextComponent";
import { TripExpenseSummary } from "@/types/tripExpense";
import { formatCurrency } from "@/utils/formatters";

interface Props {
    summary: TripExpenseSummary[];
}

export default function ExpenseSummaryList({ summary }: Props) {
    if (summary.length === 0) return null; // 지출 내역이 없을 경우의 예외처리 추가 가능

    return (
        <Card className="p-6 mb-6 shadow-sm border border-slate-50">
            {summary.map(item => (
                <View
                    className="flex-row items-center justify-between mb-5 last:mb-0"
                    key={item.category}>
                    <View className="flex-row items-center gap-4">
                        <View
                            className="p-2.5 rounded-full"
                            style={{ backgroundColor: `${item.color}15` }}>
                            <Feather color={item.color} name={item.icon as any} size={18} />
                        </View>
                        <TextComponent className="text-text-primary text-[15px] font-medium">
                            {item.label}
                        </TextComponent>
                    </View>
                    <View className="flex-row items-center gap-6">
                        <TextComponent className="text-text-primary text-[15px] font-bold">
                            {formatCurrency(item.amount, "KRW")}
                        </TextComponent>
                        <TextComponent className="text-text-secondary text-[14px] w-10 text-right">
                            {item.percentage}%
                        </TextComponent>
                    </View>
                </View>
            ))}
        </Card>
    );
}
