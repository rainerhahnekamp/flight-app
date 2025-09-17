import { z } from 'zod';

const flightSchema = z.object({
  id: z.number(),
  from: z.string(),
  to: z.string(),
  date: z.string(),
  delayed: z.boolean(),
});

export function toFlight(value: unknown) {
  return flightSchema.parse(value);
}

export function toFlights(value: unknown): Flight[] {
  return z.array(flightSchema).parse(value);
}

export type Flight = z.infer<typeof flightSchema>;

export const initFlight: Flight = {
  id: 0,
  from: '',
  to: '',
  date: '',
  delayed: false,
};
