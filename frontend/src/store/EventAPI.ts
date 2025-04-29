import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const EventAPI = createApi({
  reducerPath: 'eventAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}`,
  }),
  tagTypes: ['Event'],
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
    }) 
  })
})