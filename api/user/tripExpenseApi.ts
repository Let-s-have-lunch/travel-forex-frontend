import api from "@/api/axiosInstance";
import { TripExpense } from "@/types/tripExpense";
import { PaginationResponseType } from "@/types/common";
import { Trip } from "@/types/trip";

const getTripById = async (tripId: number): Promise<Trip> => {
    const response = await api.get(`/trips/${tripId}`);
    return response.data.data;
};

const fetchTripExpenseList = async (
    tripId: number,
    page: number = 1,
    size: number = 100, // 요약 정보를 위해 넉넉히 가져옴
): Promise<PaginationResponseType<TripExpense>> => {
    const response = await api.get(`/trips/${tripId}/expenses`, {
        params: {
            page,
            size,
        },
    });
    return response.data.data;
};

// ... 나머지 함수들 (createTrip, updateTrip, deleteTrip)

export default {
    getTripById,
    fetchTripExpenseList,
    // ...
};
