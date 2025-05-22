import { z } from 'zod';

const flightSchema = z.object({
  id: z.number(),
  from: z.string(),
  to: z.string(),
  date: z.string(),
  delayed: z.boolean(),
});

export type Flight = z.infer<typeof flightSchema>;

const flightsSchema = z.array(flightSchema);

export function parseFlights(data: unknown): Flight[] {
  const start = Date.now();
  const flights = flightsSchema.parse(data);
  console.log('Time Duration: ', Date.now() - start);
  return flights;
}

export const initFlight: Flight = {
  id: 0,
  from: '',
  to: '',
  date: '',
  delayed: false,
};
