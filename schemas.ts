import { z } from 'zod';
export const readingSchema = z.object({
    timestamp: z.number(),
    face: z.enum(['NORTH', 'SOUTH', 'EAST', 'WEST']),
    temperature_value: z.number(),
    sensor_id: z.number(),               
});