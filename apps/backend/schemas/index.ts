import { z } from 'zod';
import luhn from 'luhn';

export const zPkSchema = z.string().length(24).regex(/^pk_test_[A-Za-z0-9]*$/);
export const zCardNumberSchema = z.string().min(13).max(16).refine((val) => luhn.validate(val), {
  message: 'Invalid card number.',
});

const NOW = new Date();
const currentUTCYear = NOW.getUTCFullYear();
const currentUTCMonth = NOW.getUTCMonth() + 1;
const zEmailSchema = z.string().min(5).max(100).email();

export const zCreateCardTokenizerSchema = z.object({
  card_number: zCardNumberSchema,
  cvv: z.number().int().positive().gte(100).lte(9999),
  expiration_month: z.coerce.number().int().positive().gte(1).lte(12),
  expiration_year: z.coerce.number().int().positive().gte(currentUTCYear).lte(currentUTCYear + 5),
  email: z.union([
    zEmailSchema.endsWith('gmail.com'),
    zEmailSchema.endsWith('hotmail.com'),
    zEmailSchema.endsWith('yahoo.es'),
  ]),
})
  .strict()
  .superRefine((values, context) => {
    if (currentUTCYear === values.expiration_year && values.expiration_month < currentUTCMonth) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Card already expired.',
        path: ['expiration_month'],
      });
    }
  });

export const zRetrieveCardDataSchema = z.object({
  token: z.string().length(16).regex(/^[A-Za-z0-9]*$/),
}).strict();
