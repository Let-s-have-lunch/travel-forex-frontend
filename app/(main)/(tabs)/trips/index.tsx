import { useCallback, useEffect, useState } from "react";
import { Image } from "react-native";
import TextComponent from "@/components/common/text/TextComponent";
import { Alert, FlatList, Platform, Pressable, TouchableOpacity, View } from "react-native";
import LoadingIndicator from "@/components/common/loading/Loading";
import Button from "@/components/common/button/Button";
import { Feather } from "@expo/vector-icons";
import Pagination from "@/components/common/pagination/Pagination";
import { Trip } from "@/types/trip";
import { useLocalSearchParams, useRouter } from "expo-router";
import tripApi from "@/api/user/tripApi";
import TripFormModal from "@/components/domain/trips/TripFormModal";
import { TripInputType } from "@/schemas/trip/tripSchema";
import Title from "@/components/common/title/Title";
import { TabType } from "@/types/status";
import Card from "@/components/common/card/Card";
import { getTripThumbnail } from "@/utils/tripImage";

export default function TripListPage() {
    const router = useRouter();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [total, setTotal] = useState(0);
    const [activeTab, setActiveTab] = useState<TabType>("ONGOING");

    // 메뉴 팝오버 대상 trip ID 관리
    const [selectedMenuTripId, setSelectedMenuTripId] = useState<number | null>(null);

    // 폼 모달 관련 상태
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();
    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 5;

    // 🛠️ [수정] status 파라미터 추가 (ONGOING 또는 PAST)
    const fetchTrips = useCallback(
        async (targetPage: number, targetSize: number, status: TabType) => {
            setLoading(true);
            try {
                // 🛠️ [수정] 백엔드 API 호출 시 status 값 전달
                const result = await tripApi.fetchTripList(targetPage, targetSize, status);
                setTrips(result.list || []);
                setTotal(result.total ?? result.list?.length ?? 0);
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("여행 목록을 불러오는데 실패했습니다.");
                } else {
                    Alert.alert("오류", "여행 목록을 불러오는데 실패했습니다.", [
                        { text: "확인", onPress: () => router.back() },
                    ]);
                }
            } finally {
                setLoading(false);
            }
        },
        [router],
    );

    // 🛠️ [수정] 렌더링 시 fetchTrips에 현재 activeTab을 인자로 넘김
    useEffect(() => {
        fetchTrips(currentPage, pageSize, activeTab).then(() => {});
    }, [currentPage, fetchTrips, pageSize, activeTab]); // 🆕 [추가] 의존성 배열에 activeTab 추가

    // 공지사항과 동일한 계산 방식 적용 (전체 개수 total 기준)
    const totalPages = Math.ceil(total / pageSize) || 1;

    // 페이지 변경 핸들러
    const handlePageChange = (newPage: number) => {
        setSelectedMenuTripId(null);
        router.setParams({ page: String(newPage), size: String(pageSize) });
    };

    // 탭 전환 핸들러 (1페이지로 이동)
    const handleTabChange = (tab: TabType) => {
        setSelectedMenuTripId(null);
        setActiveTab(tab);
        router.setParams({ page: "1", size: String(pageSize) });
    };

    // 삭제 API 실행
    const confirmDelete = async (id: number) => {
        try {
            await tripApi.deleteTrip(id);
            await fetchTrips(currentPage, pageSize, activeTab); // 🛠️ [수정] 삭제 후 목록 갱신 시 activeTab 전달
        } catch (error) {
            console.log(error);
            if (Platform.OS === "web") {
                alert("삭제 중 오류가 발생했습니다.");
            } else {
                Alert.alert("오류", "삭제 중 오류가 발생했습니다.");
            }
        }
    };

    // 삭제 요청 핸들러
    const handleDeleteTrip = (id: number) => {
        setSelectedMenuTripId(null);
        if (Platform.OS === "web") {
            if (window.confirm("정말로 이 여행 일정을 삭제하시겠습니까?")) {
                confirmDelete(id);
            }
        } else {
            Alert.alert("여행 삭제", "정말로 이 여행 일정을 삭제하시겠습니까?", [
                { text: "취소", style: "cancel" },
                {
                    text: "삭제",
                    style: "destructive",
                    onPress: () => confirmDelete(id),
                },
            ]);
        }
    };

    // 수정 버튼 클릭
    const handleEditTrip = (trip: Trip) => {
        setSelectedMenuTripId(null);
        setEditingTrip(trip);
        setIsFormVisible(true);
    };

    // 폼 저장 시 처리 로직
    const handleSaveTrip = async (data: TripInputType) => {
        if (editingTrip) {
            await tripApi.updateTrip(editingTrip.id, data);
        } else {
            await tripApi.createTrip(data);
        }
        await fetchTrips(currentPage, pageSize, activeTab); // 🛠️ [수정] 추가/수정 후 목록 갱신 시 activeTab 전달
    };

    const calculateDays = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("ko-KR").format(amount);
    };

    const renderTripItem = ({ item }: { item: Trip }) => {
        const days = calculateDays(item.startDate, item.endDate);
        const formattedStart = item.startDate.replace(/-/g, ".");
        const formattedEnd = item.endDate.slice(5).replace(/-/g, ".");
        const isMenuOpen = selectedMenuTripId === item.id;

        return (
            <View className="relative mb-4 z-10">
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        setSelectedMenuTripId(null);
                        router.push(`/trips/${item.id}`);
                    }}>
                    <Card className="flex-row items-center p-4 relative">
                        <View className="w-16 h-[88px] rounded-xl bg-primary-sub mr-4 overflow-hidden">
                            <Image
                                source={getTripThumbnail(item.currency)}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                }}
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
                                setSelectedMenuTripId(prev => (prev === item.id ? null : item.id));
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
                            onPress={() => setSelectedMenuTripId(null)}
                        />

                        <View
                            className="absolute top-12 right-2 w-28 bg-surface rounded-2xl border border-divider shadow-xl z-50 overflow-hidden"
                            style={{ elevation: 5 }}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => handleEditTrip(item)}
                                className="flex-row items-center px-4 py-3 border-b border-divider">
                                <Feather name="edit-2" size={14} color="#6BC1B6" className="mr-2" />
                                <TextComponent className="text-sm font-medium text-text-primary">
                                    수정
                                </TextComponent>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => handleDeleteTrip(item.id)}
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
    };


    return (
        <View className="flex-1 bg-background">
            <Title title="여행 목록" showBackButton={true} onBackPress={() => router.back()}>
                <View className="flex-1 flex-row justify-end pr-2">
                    <Button
                        variant="outlined"
                        shape="circle"
                        size="small"
                        onPress={() => {
                            setSelectedMenuTripId(null);
                            setEditingTrip(null);
                            setIsFormVisible(true);
                        }}>
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
                    renderItem={renderTripItem}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
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

            {/* 추가 및 수정을 위한 모달 컴포넌트 */}
            <TripFormModal
                visible={isFormVisible}
                initialData={editingTrip}
                onClose={() => setIsFormVisible(false)}
                onSubmit={handleSaveTrip}
            />
        </View>
    );
}
