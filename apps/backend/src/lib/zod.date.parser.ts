import z from 'zod';

export function overrideJSONSchema<T>(
  parser: z.ZodType<T>,
  customJSONSchema: unknown,
): z.ZodType<T> {
  parser._zod.toJSONSchema = () => customJSONSchema;
  return parser;
}
export function dateTime(): z.ZodType<Date> {
  return overrideJSONSchema(
    z.union([z.date(), z.iso.datetime().pipe(z.coerce.date())]),
    z.toJSONSchema(z.iso.datetime()),
  );
}
