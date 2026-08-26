import { memo } from "react";
import { Image, Pressable, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import Card from "@/components/common/card/Card";
import TextComponent from "@/components/common/text/TextComponent";
import { Trip } from "@/types/trip";
import { getTripThumbnail } from "@/utils/tripImage";
import { calculateDays, formatCurrency } from "@/utils/formatters"; // 👈 유틸 임포트

interface TripListItemProps {
    item: Trip;
    isMenuOpen: boolean;
    onPress: (id: number) => void;
    onMenuToggle: (id: number) => void;
    onMenuClose: () => void;
    onEdit: (trip: Trip) => void;
    onDelete: (id: number) => void;
}

const TripListItem = memo(
    ({
        item,
        isMenuOpen,
        onPress,
        onMenuToggle,
        onMenuClose,
        onEdit,
        onDelete,
    }: TripListItemProps) => {
        const days = calculateDays(item.startDate, item.endDate);
        const formattedStart = item.startDate.replace(/-/g, ".");
        const formattedEnd = item.endDate.slice(5).replace(/-/g, ".");

        return (
            <View className="relative mb-4 z-10">
                <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(item.id)}>
                    <Card className="flex-row items-center p-4 relative">
                        <View className="w-16 h-[88px] rounded-xl bg-primary-sub mr-4 overflow-hidden">
                            <Image
                                source={getTripThumbnail(item.currency)}
                                style={{ width: "100%", height: "100%" }}
                                resizeMode="cover"
                            />
                        </View>

                        <View className="flex-1 justify-center gap-1 pr-6">
                            <TextComponent className="text-lg font-bold text-text-primary">
                                {item.title}
                            </TextComponent>
                            <TextComponent className="text-xs text-text-tertiary">
                                {`${formattedStart} ~ ${formattedEnd} (${days}일)`}
                            </TextComponent>

                            <View className="flex-row items-center mt-1">
                                <View className="w-1 h-1 rounded-full bg-primary-main mr-1.5" />
                                <TextComponent className="text-xs text-text-secondary">
                                    예산 ₩ {formatCurrency(item.budgetKrw)}
                                </TextComponent>
                            </View>
                            <View className="flex-row items-center">
                                <View className="w-1 h-1 rounded-full bg-accent-coral mr-1.5" />
                                <TextComponent className="text-xs text-text-secondary">
                                    지출 ₩ 0
                                </TextComponent>
                            </View>
                        </View>

                        <TouchableOpacity
                            className="absolute top-4 right-2 p-2"
                            onPress={e => {
                                e.stopPropagation();
                                onMenuToggle(item.id);
                            }}>
                            <Feather name="more-vertical" size={20} color="#888" />
                        </TouchableOpacity>
                    </Card>
                </TouchableOpacity>

                {isMenuOpen && (
                    <>
                        <Pressable
                            className="absolute z-40"
                            style={{ top: -2000, bottom: -2000, left: -2000, right: -2000 }}
                            onPress={onMenuClose}
                        />
                        <View
                            className="absolute top-12 right-2 w-28 bg-surface rounded-2xl border border-divider shadow-xl z-50 overflow-hidden"
                            style={{ elevation: 5 }}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => onEdit(item)}
                                className="flex-row items-center px-4 py-3 border-b border-divider">
                                <Feather name="edit-2" size={14} color="#6BC1B6" className="mr-2" />
                                <TextComponent className="text-sm font-medium text-text-primary">
                                    수정
                                </TextComponent>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => onDelete(item.id)}
                                className="flex-row items-center px-4 py-3">
                                <Feather
                                    name="trash-2"
                                    size={14}
                                    color="#FF6B6B"
                                    className="mr-2"
                                />
                                <TextComponent className="text-sm font-medium text-accent-coral">
                                    삭제
                                </TextComponent>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        );
    },
);

export default TripListItem;
