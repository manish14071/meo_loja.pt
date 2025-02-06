import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constants";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: CATEGORY_URL,
      }),
      providesTags: ["Category"],
      keepUnusedDataFor: 5,
    }),

    getCategoryById: builder.query({
      query: (categoryId) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    createCategory: builder.mutation({
      query: (data) => ({
        url: CATEGORY_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation({
      query: ({ categoryId, name }) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `${CATEGORY_URL}/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApiSlice;
