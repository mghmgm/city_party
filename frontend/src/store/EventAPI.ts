import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const EventAPI = createApi({
  reducerPath: 'eventAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}`,
  }),
  tagTypes: ['Event', 'Review'],
  endpoints: (build) => ({

    // подгрузить все события
    fetchEvents: build.query({
      query: (limit) => ({
        url: `/events`,
        params: {
          _limit: limit,
        }
      }),
      providesTags: ['Event'],
    }),

    // подгрузить событие по айди
    fetchEventById: build.query({
      query: (id) => ({
        url: `/events/${id}`
      }),
      providesTags: ['Event'],
    }),

    // подгрузить события по категории
    fetchEventsByCategory: build.query({
      query: (category) => ({
        url: `/events/${category}`
      }),
      providesTags: ['Event']
    }),

    // подгрузить отзывы к событию
    fetchReviews: build.query({
      query: (id) => ({
        url: `/events/${id}/reviews/`
      }),
      providesTags: ['Event', 'Review']
    }),

    // редактирование отзыва (+для отклонения/принятия админом)
    updateReview: build.mutation({
      query: ({eventId, review}) => ({
        url: `/events/${eventId}/reviews/`,
        method: 'PUT',
        body: review,
      }),
      invalidatesTags: ['Event', 'Review']
    }),
  })
})