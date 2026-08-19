import React from "react";
import { View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    // 5개씩 그룹화 로직
    const maxPageButtons = 5;
    const currentGroup = Math.ceil(currentPage / maxPageButtons);
    const startPage = (currentGroup - 1) * maxPageButtons + 1;
    const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    if (totalPages <= 1) return null;

    return (
        <View className="flex-row justify-center items-center py-4 gap-2">
            {/* 이전 그룹/페이지 버튼 */}
            <Pressable
                disabled={currentPage === 1}
                onPress={() => onPageChange(currentPage - 1)}
                className={twMerge(
                    "p-2.5 rounded-2xl bg-surface border border-border justify-center items-center active:bg-primary-sub",
                    currentPage === 1 && "opacity-30",
                )}>
                {/* travel-forex의 text-tertiary 색상(#86918c) 적용 */}
                <Feather name="chevron-left" size={18} color="#86918c" />
            </Pressable>

            {/* 페이지 번호 버튼들 */}
            {pageNumbers.map(num => {
                const isSelected = num === currentPage;
                return (
                    <Pressable
                        key={num}
                        onPress={() => onPageChange(num)}
                        className={twMerge(
                            "w-10 h-10 rounded-2xl justify-center items-center border transition-all",
                            isSelected
                                ? "bg-primary-main border-primary-main shadow-sm"
                                : "bg-surface border-border active:bg-primary-sub",
                        )}>
                        <TextComponent
                            className={twMerge(
                                "text-sm font-semibold",
                                isSelected ? "text-surface font-bold" : "text-text-secondary",
                            )}>
                            {num}
                        </TextComponent>
                    </Pressable>
                );
            })}

            {/* 다음 그룹/페이지 버튼 */}
            <Pressable
                disabled={currentPage === totalPages}
                onPress={() => onPageChange(currentPage + 1)}
                className={twMerge(
                    "p-2.5 rounded-2xl bg-surface border border-border justify-center items-center active:bg-primary-sub",
                    currentPage === totalPages && "opacity-30",
                )}>
                {/* travel-forex의 text-tertiary 색상(#86918c) 적용 */}
                <Feather name="chevron-right" size={18} color="#86918c" />
            </Pressable>
        </View>
    );
}
