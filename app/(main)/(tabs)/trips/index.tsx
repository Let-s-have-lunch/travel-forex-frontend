import { useCallback, useEffect, useState } from "react";
import TextComponent from "@/components/common/text/TextComponent";
import { Alert, FlatList, Platform, TouchableOpacity, View } from "react-native";
import LoadingIndicator from "@/components/common/loading/Loading";
import Button from "@/components/common/button/Button";
import { Feather } from "@expo/vector-icons";
import Card from "@/components/common/card/Card";
import Title from "@/components/common/title/title";
import { Trip } from "@/types/trip";
import { useLocalSearchParams, useRouter } from "expo-router";
import tripApi from "@/api/user/tripApi";
import { TripInputType } from "@/schema/tripSchema";
import TripFormModal from "@/components/domain/trips/TripFormModal";

type TabType = "ONGOING" | "PAST";

export default function TripListPage({ navigation }: any) {
    const router = useRouter();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [total, setTotal] = useState(0);
    const [activeTab, setActiveTab] = useState<TabType>("ONGOING");

    // 폼 모달 관련 상태
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();
    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 5;
    const totalPage = Math.ceil(total / pageSize) || 1;

    const fetchTrips = useCallback(
        async (targetPage: number, targetSize: number) => {
            setLoading(true);
            try {
                const result = await tripApi.fetchTripList(targetPage, targetSize);
                setTrips(result.list);
                setTotal(result.total);
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

    useEffect(() => {
        fetchTrips(currentPage, pageSize).then(() => {});
    }, [currentPage, fetchTrips, pageSize]);

    // 삭제 API 호출 로직
    const handleDeleteTrip = async (id: number) => {
        // TODO: 실제 tripApi.deleteTrip(id) 호출 로직 연결
        console.log(`${id}번 여행 삭제 API 쏘기`);
        // await tripApi.deleteTrip(id);
        // fetchTrips(currentPage, pageSize);
    };

    // 옵션 메뉴 열기 (수정 / 삭제)
    const handleMoreOption = (trip: Trip) => {
        Alert.alert("여행 관리", "원하시는 작업을 선택해주세요.", [
            {
                text: "수정",
                onPress: () => {
                    setEditingTrip(trip);
                    setIsFormVisible(true);
                },
            },
            {
                text: "삭제",
                onPress: () => handleDeleteTrip(trip.id),
                style: "destructive", // iOS에서 빨간색으로 표시됨
            },
            {
                text: "취소",
                style: "cancel",
            },
        ]);
    };

    // 폼 저장 시 처리 로직
    const handleSaveTrip = async (data: TripInputType) => {
        if (editingTrip) {
            console.log("수정 API 쏘기", data);
            // await tripApi.updateTrip(editingTrip.id, data);
        } else {
            console.log("생성 API 쏘기", data);
            // await tripApi.createTrip(data);
        }
        // 저장 후 목록 리프레시
        fetchTrips(currentPage, pageSize);
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

        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push(`/trips/${item.id}`)}>
                <Card className="flex-row items-center p-4 relative mb-4">
                    {/* 좌측 썸네일 */}
                    <View className="w-16 h-16 rounded-2xl bg-primary-sub mr-4 overflow-hidden" />

                    {/* 우측 텍스트 정보 */}
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

                    {/* 더보기 (수정/삭제) 메뉴 버튼 - 파란색 점 3개 자리! */}
                    <TouchableOpacity
                        className="absolute top-4 right-2 p-2"
                        onPress={() => handleMoreOption(item)}>
                        <Feather name="more-vertical" size={20} color="#888" />
                    </TouchableOpacity>
                </Card>
            </TouchableOpacity>
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
                            setEditingTrip(null); // 추가 모드
                            setIsFormVisible(true);
                        }}>
                        <Feather name="plus" size={20} color="#6BC1B6" />
                    </Button>
                </View>
            </Title>

            {/* 탭 및 리스트 렌더링 영역 (기존과 동일하여 생략/유지) */}
            <View className="flex-row px-5 py-4 gap-2">
                <Button
                    wrap
                    variant={activeTab === "ONGOING" ? "contained" : "outlined"}
                    shape="rounded"
                    color="primary"
                    onPress={() => {
                        setActiveTab("ONGOING");
                        router.setParams({ page: "1" });
                    }}
                    className={activeTab === "ONGOING" ? "" : "border-border bg-surface"}
                    textClassName={activeTab === "ONGOING" ? "" : "text-text-tertiary"}>
                    진행중
                </Button>
                <Button
                    wrap
                    variant={activeTab === "PAST" ? "contained" : "outlined"}
                    shape="rounded"
                    color="primary"
                    onPress={() => {
                        setActiveTab("PAST");
                        router.setParams({ page: "1" });
                    }}
                    className={activeTab === "PAST" ? "" : "border-border bg-surface"}
                    textClassName={activeTab === "PAST" ? "" : "text-text-tertiary"}>
                    지난 여행
                </Button>
            </View>

            {loading ? (
                <LoadingIndicator />
            ) : (
                <FlatList
                    data={trips}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderTripItem}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
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
