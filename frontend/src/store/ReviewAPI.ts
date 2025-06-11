import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ReviewAPI = createApi({
  reducerPath: 'reviewAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Review'],
  endpoints: (build) => ({
    fetchModerationReviews: build.query({
      query: () => ({
        url: '/reviews/moderation/',
      }),
      providesTags: ['Review'],
    }),

    acceptOrRejectReview: build.mutation({
      query: ({ reviewId, status }) => ({
        url: `/reviews/${reviewId}/`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Review'],
    }),
  }),
});

export const { useFetchModerationReviewsQuery, useAcceptOrRejectReviewMutation } =
  ReviewAPI;
