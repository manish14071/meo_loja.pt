import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      // Add transformResponse to handle the token
      transformResponse: (response) => {
        // Ensure we're returning both the user info and the token
        return {
          ...response,
          token: response.token, // Make sure your backend sends the token
        };
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
        credentials: "include",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),

    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
        method: "GET",
      }),
      providesTags: (result = []) => [
        { type: "User", id: "LIST" },
        ...result.map(({ _id }) => ({ type: "User", id: _id })),
      ],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
          url: `${USERS_URL}/${userId}`,
          method: 'DELETE',
          credentials: 'include', // Add this if you need authentication
      }),
      invalidatesTags: (result, error, userId) => [
          { type: 'User', id: userId },
          { type: 'User', id: 'LIST' }
      ],
  }),

    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),

      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
      ],
    }),

    updateUserAdmin: builder.mutation({
      query: ({ userId, isadmin }) => ({
        url: `${USERS_URL}/${userId}/admin`,
        method: 'PUT',
        body: { isadmin },
        credentials: 'include',
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId },
        { type: 'User', id: 'LIST' }
      ],
    }),

    getUserStats: builder.query({
      query: () => ({
        url: `${USERS_URL}/stats`,
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useGetUserStatsQuery,
  useUpdateUserAdminMutation
} = usersApiSlice;
