import { z } from 'zod';
import { RequestSchemaValidationFailed } from '../RequestSchemaValidationFailed';

export const validateRequestSchema = (data: unknown, schema: z.ZodSchema): Record<string, unknown> => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = JSON.parse(JSON.stringify(result)).error.issues;
    throw new RequestSchemaValidationFailed(errors);
  }

  return result.data;
};