import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingsApi, type BookingPayload } from "./bookings.api";

export const bookingKeys = {
  all: ["bookings"] as const,
  list: (query: string) => ["bookings", "list", query] as const,
  summary: ["bookings", "summary"] as const,
};

export function useBookingsQuery(query: string) {
  return useQuery({
    queryKey: bookingKeys.list(query),
    queryFn: () => bookingsApi.list(query),
  });
}

export function useBookingSummaryQuery() {
  return useQuery({
    queryKey: bookingKeys.summary,
    queryFn: bookingsApi.summary,
  });
}

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (booking: BookingPayload) => bookingsApi.create(booking),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: bookingKeys.all }),
  });
}

export function useUpdateBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, booking }: { id: number; booking: BookingPayload }) =>
      bookingsApi.update(id, booking),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: bookingKeys.all }),
  });
}
