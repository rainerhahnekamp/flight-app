import { z } from 'zod';

const flightSchema = z.object({
  id: z.number(),
  from: z.string(),
  to: z.string(),
  date: z.string(),
  delayed: z.boolean(),
});

export const flightsSchema = z.array(flightSchema);

export const parseFlightSchema = (value: unknown) => flightsSchema.parse(value);

export type Flight = z.infer<typeof flightSchema>;

export const initFlight: Flight = {
  id: 0,
  from: '',
  to: '',
  date: '',
  delayed: false,
};
