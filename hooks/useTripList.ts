import { useState, useCallback, useEffect } from "react";
import { Alert, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import { Trip } from "@/types/trip";
import { TabType } from "@/types/status";
import { TripInputType } from "@/schemas/trip/tripSchema";
import tripApi from "@/api/user/tripApi";

export const useTripList = () => {
    const router = useRouter();
    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();

    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 5;

    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [total, setTotal] = useState(0);
    const [activeTab, setActiveTab] = useState<TabType>("ONGOING");
    const [selectedMenuTripId, setSelectedMenuTripId] = useState<number | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

    const totalPages = Math.ceil(total / pageSize) || 1;

    const fetchTrips = useCallback(
        async (targetPage: number, targetSize: number, status: TabType) => {
            setLoading(true);
            try {
                const result = await tripApi.fetchTripList(targetPage, targetSize, status);
                setTrips(result.list || []);
                setTotal(result.total ?? result.list?.length ?? 0);
            } catch (error) {
                console.log(error);
                const msg = "여행 목록을 불러오는데 실패했습니다.";
                Platform.OS === "web"
                    ? alert(msg)
                    : Alert.alert("오류", msg, [{ text: "확인", onPress: () => router.back() }]);
            } finally {
                setLoading(false);
            }
        },
        [router],
    );

    useEffect(() => {
        fetchTrips(currentPage, pageSize, activeTab);
    }, [currentPage, pageSize, activeTab, fetchTrips]);

    const handlePageChange = useCallback(
        (newPage: number) => {
            setSelectedMenuTripId(null);
            router.setParams({ page: String(newPage), size: String(pageSize) });
        },
        [pageSize, router],
    );

    const handleTabChange = useCallback(
        (tab: TabType) => {
            setSelectedMenuTripId(null);
            setActiveTab(tab);
            router.setParams({ page: "1", size: String(pageSize) });
        },
        [pageSize, router],
    );

    const confirmDelete = async (id: number) => {
        try {
            await tripApi.deleteTrip(id);
            await fetchTrips(currentPage, pageSize, activeTab);
        } catch (error) {
            console.log(error);
            const msg = "삭제 중 오류가 발생했습니다.";
            Platform.OS === "web" ? alert(msg) : Alert.alert("오류", msg);
        }
    };

    const handleDeleteTrip = useCallback(
        (id: number) => {
            setSelectedMenuTripId(null);
            if (Platform.OS === "web") {
                if (window.confirm("정말로 이 여행 일정을 삭제하시겠습니까?")) {
                    confirmDelete(id);
                }
            } else {
                Alert.alert("여행 삭제", "정말로 이 여행 일정을 삭제하시겠습니까?", [
                    { text: "취소", style: "cancel" },
                    { text: "삭제", style: "destructive", onPress: () => confirmDelete(id) },
                ]);
            }
        },
        [currentPage, pageSize, activeTab],
    );

    const handleEditTrip = useCallback((trip: Trip) => {
        setSelectedMenuTripId(null);
        setEditingTrip(trip);
        setIsFormVisible(true);
    }, []);

    const handleSaveTrip = async (data: TripInputType) => {
        if (editingTrip) {
            await tripApi.updateTrip(editingTrip.id, data);
        } else {
            await tripApi.createTrip(data);
        }
        await fetchTrips(currentPage, pageSize, activeTab);
    };

    const openAddTripModal = () => {
        setSelectedMenuTripId(null);
        setEditingTrip(null);
        setIsFormVisible(true);
    };

    const closeFormModal = () => setIsFormVisible(false);

    return {
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
    };
};
