import { View, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import TextComponent from "@/components/common/text/TextComponent";
import LoadingIndicator from "@/components/common/loading/Loading";
import Button from "@/components/common/button/Button";
import Pagination from "@/components/common/pagination/Pagination";
import Title from "@/components/common/title/Title";
import TripFormModal from "@/components/domain/trips/TripFormModal";
import TripListItem from "@/components/domain/trips/TripListItem";

import { useTripList } from "@/hooks/useTripList";

export default function TripListPage() {
    const router = useRouter();

    // 훅에서 필요한 상태와 함수만 쏙쏙 뽑아옵니다.
    const {
        trips,
        loading,
        activeTab,
        currentPage,
        totalPages,
        selectedMenuTripId,
        isFormVisible,
        editingTrip,
        handlePageChange,
        handleTabChange,
        handleDeleteTrip,
        handleEditTrip,
        handleSaveTrip,
        openAddTripModal,
        closeFormModal,
        setSelectedMenuTripId,
    } = useTripList();

    return (
        <View className="flex-1 bg-background">
            <Title title="여행 목록" showBackButton onBackPress={() => router.back()}>
                <View className="flex-1 flex-row justify-end pr-2">
                    <Button
                        variant="outlined"
                        shape="circle"
                        size="small"
                        onPress={openAddTripModal}>
                        <Feather name="plus" size={20} color="#6BC1B6" />
                    </Button>
                </View>
            </Title>

            {/* 탭 영역 */}
            <View className="flex-row px-5 py-4 gap-2">
                <Button
                    wrap
                    variant={activeTab === "ONGOING" ? "contained" : "outlined"}
                    shape="rounded"
                    color="primary"
                    onPress={() => handleTabChange("ONGOING")}
                    className={activeTab === "ONGOING" ? "" : "border-border bg-surface"}
                    textClassName={activeTab === "ONGOING" ? "" : "text-text-tertiary"}>
                    진행중
                </Button>
                <Button
                    wrap
                    variant={activeTab === "PAST" ? "contained" : "outlined"}
                    shape="rounded"
                    color="primary"
                    onPress={() => handleTabChange("PAST")}
                    className={activeTab === "PAST" ? "" : "border-border bg-surface"}
                    textClassName={activeTab === "PAST" ? "" : "text-text-tertiary"}>
                    지난 여행
                </Button>
            </View>

            {/* 목록 영역 */}
            {loading ? (
                <LoadingIndicator />
            ) : (
                <FlatList
                    data={trips}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TripListItem
                            item={item}
                            isMenuOpen={selectedMenuTripId === item.id}
                            onPress={() => {
                                setSelectedMenuTripId(null);
                                router.push(`/trips/${item.id}`);
                            }}
                            onMenuToggle={() =>
                                setSelectedMenuTripId(prev => (prev === item.id ? null : item.id))
                            }
                            onMenuClose={() => setSelectedMenuTripId(null)}
                            onEdit={handleEditTrip}
                            onDelete={handleDeleteTrip}
                        />
                    )}
                    ListEmptyComponent={
                        <View className="py-12 items-center justify-center">
                            <TextComponent className="text-text-tertiary text-sm">
                                {activeTab === "ONGOING"
                                    ? "진행 중인 여행 일정이 없습니다."
                                    : "지난 여행 일정이 없습니다."}
                            </TextComponent>
                        </View>
                    }
                    ListFooterComponent={
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    }
                />
            )}

            <TripFormModal
                visible={isFormVisible}
                initialData={editingTrip}
                onClose={closeFormModal}
                onSubmit={handleSaveTrip}
            />
        </View>
    );
}
