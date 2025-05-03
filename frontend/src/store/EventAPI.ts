import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IEvent, IGallery, IReview, ITicketType } from '../types/types';

export const EventAPI = createApi({
  reducerPath: 'eventAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}`,
    prepareHeaders:(headers)=>{
      const token = localStorage.getItem('accessToken')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Event', 'Review', 'Gallery', 'TiketType'],
  endpoints: (build) => ({
    // подгрузить все события
    fetchEvents: build.query<IEvent[], { limit: number; ordering?: string }>({
      query: ({ limit, ordering = '' }) => ({
        url: `/events`,
        params: {
          limit: limit.toString(),
          ordering: ordering || '',
        },
      }),
      providesTags: ['Event'],
    }),

    // подгрузить событие по айди
    fetchEventById: build.query<IEvent, number>({
      query: (id) => ({
        url: `/events/${id}`,
      }),
      providesTags: ['Event'],
    }),

    // подгрузить события по категории
    fetchEventsByCategory: build.query<IEvent[], string>({
      query: (category) => ({
        url: `/events/category/${category}`,
      }),
      providesTags: ['Event'],
    }),

    // подгрузить события по поиску
    searchEvents: build.query<IEvent[], string>({
      query: (searchValue) => ({
        url: `/events`,
        params: {
          search: searchValue,
        },
      }),
      providesTags: ['Event'],
    }),

    // подгрузить отзывы к событию
    fetchReviews: build.query<IReview[], number>({
      query: (id) => ({
        url: `/events/${id}/reviews/`,
      }),
      providesTags: ['Event', 'Review'],
    }),

    // подгрузить галерею к событию
    fetchGallery: build.query<IGallery, number>({
      query: (id) => ({
        url: `/events/${id}/gallery/`,
      }),
      providesTags: ['Event', 'Gallery'],
    }),

    // подгрузить билеты к событию
    fetchTicketTypes: build.query<ITicketType[], number>({
      query: (id) => ({
        url: `/events/${id}/ticket-types/`,
      }),
      providesTags: ['Event', 'TiketType'],
    }),

    // создание отзыва
    createReview: build.mutation<IReview, { eventId: number; data: Partial<IReview> }>({
      query: ({ eventId, data }) => ({
        url: `/events/${eventId}/reviews/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Event', 'Review'],
    }),

    // редактирование отзыва (+для отклонения/принятия админом)
    updateReview: build.mutation<IReview, { eventId: number; reviewId: number; data: Partial<IReview> }>({
      query: ({ eventId, reviewId, data }) => ({
        url: `/events/${eventId}/reviews/${reviewId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Event', 'Review'],
    }),
  }),
});
