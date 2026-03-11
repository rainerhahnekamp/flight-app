import { z } from 'zod';

const flightSchema = z.object({
  id: z.number(),
  from: z.string(),
  to: z.string(),
  date: z.string(),
  delayed: z.boolean(),
});

export type Flight = z.infer<typeof flightSchema>;

// undefined vs null
// type vs interface
// structural typing

export function parseFlights(data: unknown) {
  return z.array(flightSchema).parse(data);
}

export const initFlight: Flight = {
  id: 0,
  from: '',
  to: '',
  date: '',
  delayed: false,
};
