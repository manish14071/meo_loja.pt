import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    getProducts: builder.query({
      query: ({ keyword = "", pageNumber = "" }) => ({
        url: PRODUCTS_URL,
        params: { keyword, pageNumber },
      }),
      transformResponse: (response) => {
        // Handle both array and object responses
        return response.products || response;
      },
      keepUnusedDataFor: 5,
      providesTags: ["Products"],
    }),

    getProductById: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    createProduct: builder.mutation({
      query: (productData) => ({
        url: PRODUCTS_URL,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation({
      query: ({ productId, data }) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,  // Use the constant from your config
        method: 'POST',
        body: data,
        formData: true,
        // Remove any content-type header to let browser set it with boundary
        prepareHeaders: (headers) => {
          headers.delete('Content-Type');
          return headers;
        },
      }),
      // Transform the response to match what the component expects
      transformResponse: (response) => ({
        image: response.image,
        message: response.message
      }),
      invalidatesTags: ['Product'],
    }),

    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/top`,
      }),
      keepUnusedDataFor: 5,
    }),

    getProductStats: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/stats`,
      }),
      keepUnusedDataFor: 5,
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: "POST",
        body: {
          productId: data.productId, // Ensure productId is included
          userId: data.userId,
          rating: data.rating,
          comment: data.comment,
        },
      }),
      invalidatesTags: ["Product"],
    }),
    allProducts: builder.query({
      query: () => `${PRODUCTS_URL}/all`,
      transformResponse: (response) => {
        // Ensure we always return an array
        return Array.isArray(response) ? response : response.products || [];
      },
      keepUnusedDataFor: 5,
      providesTags: ["Products"],
    }),

    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    getNewProducts: builder.query({
      query: () => `${PRODUCTS_URL}/new`,
      keepUnusedDataFor: 5,
    }),

    getFilteredProducts: builder.query({
      query: ({ checked, radio }) => ({
        url: `${PRODUCTS_URL}/filtered-products`,
        method: "POST",
        body: { checked, radio },
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useGetTopProductsQuery,
  useGetProductStatsQuery,
  useCreateReviewMutation,
  useAllProductsQuery,
  useGetProductDetailsQuery,
  useGetNewProductsQuery,
  useGetFilteredProductsQuery,
} = productApiSlice;
