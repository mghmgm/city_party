import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const TicketAPI = createApi({
  reducerPath: 'ticketAPI',
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
  tagTypes: ['Ticket'],
  endpoints: (build) => ({
    // Создание нового билета
    createTicket: build.mutation({
      query: (ticketData) => ({
        url: '/tickets/',
        method: 'POST',
        body: ticketData,
      }),
      invalidatesTags: ['Ticket'],
    }),

    updatePaymentStatus: build.mutation({
      query: ({ ticketId, payment_status }) => ({
        url: `/tickets/${ticketId}/`,
        method: 'PATCH',
        body: { payment_status },
      }),
      invalidatesTags: ['Ticket'],
    }),

    getCanceledTickets: build.query({
      query: () => ({
        url: '/tickets/?status=on_canceled',
        method: 'GET',
      }),
      providesTags: ['Ticket'],
    }),
  }),
});

export const {
  useCreateTicketMutation,
  useUpdatePaymentStatusMutation,
  useGetCanceledTicketsQuery,
} = TicketAPI;
