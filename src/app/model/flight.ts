import { z } from 'zod';

const flightSchema = z.object({
  id: z.number(),
  from: z.string(),
  to: z.string(),
  date: z.string(),
  delayed: z.boolean(),
});

export type Flight = z.infer<typeof flightSchema>;

export function toFlight(data: unknown): Flight {
  return flightSchema.parse(data);
}

export function toFlights(data: unknown) {
  return z.array(flightSchema).parse(data);
}
