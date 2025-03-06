import axios from "axios";
import { supabase } from "@/supabaseClient";
import { ExtendedBooking, PriceOffering } from "@/utils/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUserBookings = async (): Promise<ExtendedBooking[]> => {
    try {
        const auth = (await supabase.auth.getSession()).data.session?.access_token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;

        const response = await axios.get(`${API_BASE_URL}/booking/get-bookings`);
        return response.data;
    } catch (err) {
        console.error("Error fetching bookings:", err);
        throw new Error("Failed to fetch tickets. Please try again later.");
    }
};

export const lockTickets = async (eventId: string, priceOfferings: PriceOffering) => {
    try {
        const { data } = await supabase.auth.getSession();
        const auth = data.session?.access_token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;

        const response = await axios.post(`${API_BASE_URL}/booking/create-order`, {
            eventId,
            priceOfferings,
        });

        return response.data;
    } catch (error) {
        console.error("Error locking tickets:", error);
        throw error;
    }
};

export const getPendingBooking = async (eventId: string) => {
    try {
        const { data } = await supabase.auth.getSession();
        const auth = data.session?.access_token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;

        const response = await axios.get(`${API_BASE_URL}/booking/get-pending-bookings`, {
            params: { eventId },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching booking:", error);
        throw error;
    }
};

export const cancelBooking = async (bookingId: string | null) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/booking/cancel-booking`, {
            bookingId,
        });

        return response.status === 200;
    } catch (error) {
        console.error("Error cancelling tickets:", error);
        throw error;
    }
};
