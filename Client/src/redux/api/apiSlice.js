import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react"
import { BASE_URL } from "../constants"

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = localStorage.getItem("token");
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        // Don't set Content-Type for FormData
        if (!headers.get('Content-Type') && !headers.get('formData')) {
            headers.set('Content-Type', 'application/json');
        }
        return headers;
    },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        // Handle unauthorized error
        localStorage.removeItem("token");
        window.location.href = '/login';
    }
    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Product", "Order", "User", "Category"],
    endpoints: (builder) => ({})
})