import { PaginationResponseType } from "@/types/common";
import api from "@/api/axiosInstance";
import { Trip } from "@/types/trip";
import { TripInputType } from "@/schemas/trip/tripSchema";
import { TabType } from "@/types/status";

const fetchTripList = async (
    page: number,
    size: number,
    status: TabType,
): Promise<PaginationResponseType<Trip>> => {
    const response = await api.get("/trips", {
        params: {
            page,
            size,
            status,
        },
    });
    return response.data.data;
};

const getTripById = async (tripId: number): Promise<Trip> => {
    const response = await api.get(`/trips/${tripId}`);
    return response.data.data;
};

const createTrip = async (input: TripInputType): Promise<Trip> => {
    const response = await api.post("/trips", input);
    return response.data.data;
};

const updateTrip = async (tripId: number, input: TripInputType): Promise<Trip> => {
    const response = await api.patch(`/trips/${tripId}`, input);
    return response.data.data;
};

const deleteTrip = async (tripId: number): Promise<void> => {
    await api.delete(`/trips/${tripId}`);
};

export default {
    fetchTripList,
    getTripById,
    createTrip,
    updateTrip,
    deleteTrip,
};

