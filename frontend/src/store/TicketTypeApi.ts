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
      query: ({ ticketTypeId, available_quantity }) => ({
        url: `/ticket-types/${ticketTypeId}/`,
        method: 'PATCH',
        body: { available_quantity },
      }),
      invalidatesTags: ['TicketType'],
    }),
    
    getTicketTypeById: build.query({
      query: (id) => `/ticket-types/${id}/`,
      providesTags: (id) => [{ type: 'TicketType', id }],
    }),
  }),
});

export const { useUpdateTicketQuantityMutation, useGetTicketTypeByIdQuery } = TicketTypeAPI;
