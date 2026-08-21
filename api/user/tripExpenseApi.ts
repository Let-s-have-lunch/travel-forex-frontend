import api from "@/api/axiosInstance";
import { TripExpense } from "@/types/tripExpense";
import { PaginationResponseType } from "@/types/common";
import { TripExpenseInputType } from "@/schemas/tripExpense/tripExpenseSchema";

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

const getTripExpenseDetail = async (tripId: number, expenseId: number): Promise<TripExpense> => {
    const response = await api.get(`/trips/${tripId}/expenses/${expenseId}`);
    return response.data.data;
};

const createTripExpense = async (
    tripId: number,
    data: TripExpenseInputType,
): Promise<TripExpense> => {
    const response = await api.post(`/trips/${tripId}/expenses`, data);
    return response.data.data;
};

const updateTripExpense = async (
    tripId: number,
    expenseId: number,
    data: TripExpenseInputType,
): Promise<TripExpense> => {
    const response = await api.patch(`/trips/${tripId}/expenses/${expenseId}`, data);
    return response.data.data;
};

const deleteTripExpense = async (tripId: number, expenseId: number): Promise<void> => {
    const response = await api.delete(`/trips/${tripId}/expenses/${expenseId}`);
    return response.data;
};

export default {
    fetchTripExpenseList,
    getTripExpenseDetail,
    createTripExpense,
    updateTripExpense,
    deleteTripExpense,
};
