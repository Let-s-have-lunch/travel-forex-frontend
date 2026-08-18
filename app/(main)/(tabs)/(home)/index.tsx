import React, { useState } from "react";
import { View } from "react-native";
import TextComponent from "@/components/common/text/TextComponent";
import Pagination from "@/components/common/pagination/Pagination";

export default function HomePage() {
    // 테스트용 상태 (현재 페이지: 1페이지, 전체 페이지: 10페이지)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const totalPages = 10;

    return (
        <View className="flex-1 justify-center items-center bg-background p-4">
            {/* 테스트용 현재 페이지 상태 표시 */}
            <View className="mb-6 items-center">
                <TextComponent className="text-xl font-bold text-text-primary mb-2">
                    페이지네이션 테스트
                </TextComponent>
                <TextComponent className="text-base text-text-secondary">
                    현재 선택된 페이지:{" "}
                    <TextComponent className="font-bold text-primary-main">
                        {currentPage}
                    </TextComponent>{" "}
                    / {totalPages}
                </TextComponent>
            </View>

            {/* Pagination 컴포넌트 실습 적용 */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={page => setCurrentPage(page)}
            />
        </View>
    );
}
