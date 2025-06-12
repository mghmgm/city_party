import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const TicketTypeAPI = createApi({
  reducerPath: 'ticketTypeAPI',
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
  tagTypes: ['TicketType'],
  endpoints: (build) => ({
    // Обновление количества доступных билетов
    updateTicketQuantity: build.mutation({
      query: ({ ticketTypeId, amount }) => ({
        url: `/ticket-types/${ticketTypeId}/`,
        method: 'PATCH',
        body: { amount },
      }),
      invalidatesTags: ['TicketType'],
    }),
  }),
});

export const { useUpdateTicketQuantityMutation } = TicketTypeAPI;
