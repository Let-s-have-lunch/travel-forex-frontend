import React from "react";
import { View, Image } from "react-native";
import TextComponent from "@/components/common/text/TextComponent";
import { Trip } from "@/types/trip";
import { getTripThumbnail } from "@/utils/tripImage";
import { formatDateRange, formatCurrency } from "@/utils/formatters";

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View className="flex-row justify-between items-center mb-4">
        <TextComponent className="text-text-secondary text-[15px] font-medium">
            {label}
        </TextComponent>
        <TextComponent className="text-text-primary text-[15px] font-bold">{value}</TextComponent>
    </View>
);

interface Props {
    trip: Trip;
    totalExpenseKrw: number;
}

export default function TripInfoCard({ trip, totalExpenseKrw }: Props) {
    return (
        <View className="w-full bg-white rounded-[24px] overflow-hidden mb-8 shadow-sm border border-slate-50">
            {/* 이미지 자체에 aspectRatio와 width 100% 적용 */}
            <View className="w-full bg-slate-100 overflow-hidden">
                <Image
                    source={getTripThumbnail(trip.currency)}
                    style={{ width: "100%", height: 400 }}
                    resizeMode="cover"
                />
            </View>

            <View className="p-6">
                <InfoRow label="여행 기간" value={formatDateRange(trip.startDate, trip.endDate)} />
                <InfoRow label="예산 (원화)" value={formatCurrency(trip.budgetKrw, "KRW")} />
                <InfoRow label="지출 (원화)" value={formatCurrency(totalExpenseKrw, "KRW")} />
                <View className="flex-row justify-between items-center">
                    <TextComponent className="text-text-secondary text-[15px] font-medium">
                        남은 금액
                    </TextComponent>
                    <TextComponent className="text-primary-main text-[17px] font-extrabold">
                        {formatCurrency(trip.budgetKrw - totalExpenseKrw, "KRW")}
                    </TextComponent>
                </View>
            </View>
        </View>
    );
}
