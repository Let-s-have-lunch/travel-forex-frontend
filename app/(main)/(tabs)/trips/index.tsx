import { useCallback, useEffect, useState } from "react";
import TextComponent from "@/components/common/text/TextComponent";
import { Alert, FlatList, Platform, TouchableOpacity, View } from "react-native";
import LoadingIndicator from "@/components/common/loading/Loading";
import Pagination from "@/components/common/pagination/Pagination";
import Button from "@/components/common/button/Button";
import { Feather } from "@expo/vector-icons";
import Card from "@/components/common/card/Card";
import Title from "@/components/common/title/title";
import { Trip } from "@/types/trip";
import { useLocalSearchParams, useRouter } from "expo-router";
import tripApi from "@/api/user/tripApi";

type TabType = "ONGOING" | "PAST";

export default function TripListPage({ navigation }: any) {
    const router = useRouter();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [total, setTotal] = useState(0);
    const [activeTab, setActiveTab] = useState<TabType>("ONGOING");

    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();
    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 5;

    const totalPage = Math.ceil(total / pageSize) || 1;

    const fetchTrips = useCallback(
        async (targetPage: number, targetSize: number) => {
            setLoading(true); // 통신 시작 전 로딩 상태 켜기
            try {
                // 완성된 tripApi를 통해 데이터 호출
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

    // 날짜 차이 계산 함수 (예: 20일 ~ 25일 -> 6일)
    const calculateDays = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + 1; // 여행 일수는 당일 포함이므로 +1을 해줍니다.
    };

    // 금액 포맷팅 함수
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("ko-KR").format(amount);
    };

    // 여행 아이템 렌더링
    const renderTripItem = ({ item }: { item: Trip }) => {
        const days = calculateDays(item.startDate, item.endDate);
        const formattedStart = item.startDate.replace(/-/g, ".");
        const formattedEnd = item.endDate.slice(5).replace(/-/g, "."); // 08-25 -> 08.25

        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push(`/trips/${item.id}`)}>
                <Card className="flex-row items-center p-4">
                    {/* 좌측 썸네일 이미지 */}
                    <View className="w-16 h-16 rounded-2xl bg-primary-sub mr-4 overflow-hidden">
                        {/* <Image source={{ uri: '...' }} className="w-full h-full" resizeMode="cover" /> */}
                    </View>

                    {/* 우측 텍스트 정보 */}
                    <View className="flex-1 justify-center gap-1">
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
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-background">
            <Title title="여행 목록" showBackButton={true} onBackPress={() => router.back()}>
                <View className="flex-1 flex-row justify-end pr-2">
                    <Button variant="outlined" shape="circle" size="small">
                        <Feather name="plus" size={20} color="#6BC1B6" />
                    </Button>
                </View>
            </Title>

            {/* 탭 메뉴 */}
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

            {/* 리스트 영역 */}
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
                        <View className="py-20 items-center justify-center">
                            <TextComponent className="text-text-tertiary">
                                등록된 여행 일정이 없습니다.
                            </TextComponent>
                        </View>
                    }
                    ListFooterComponent={
                        trips.length > 0 ? (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPage}
                                onPageChange={newPage =>
                                    router.setParams({
                                        page: String(newPage),
                                        size: String(pageSize),
                                    })
                                }
                            />
                        ) : null
                    }
                />
            )}
        </View>
    );
}
