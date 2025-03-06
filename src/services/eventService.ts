import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getLatestEvent = async () => {
    const response = await axios.get(`${BASE_URL}/event/get-latest`);
    return response.data;
};