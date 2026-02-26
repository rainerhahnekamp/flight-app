import {z} from "zod";

const flightSchema = z.object({
  id: z.number(),
  from: z.string(),
  to: z.string(),
  date: z.string(),
  delayed: z.boolean(),
})

export type Flight = z.infer<typeof flightSchema>

export function parseFlight(data: unknown) {
  return flightSchema.parse(data);
}

export function parseFlights(data: unknown) {
  return flightSchema.array().parse(data);
}

function showFlight(flight: Flight) {
  console.log(flight);
}
