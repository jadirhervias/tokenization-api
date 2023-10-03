import { z } from 'zod';
import { HandlerLambda, NextFunction } from 'middy';
import { validateRequestSchema } from '../middlewares/validateRequestSchema';
import { validateClientPk } from '../middlewares/validateClientPk';

export const validateRequestSchemaLambdaCallback = (schema: z.ZodSchema) => {
  return async (handler: HandlerLambda, next: NextFunction) => {
    const request = JSON.parse(JSON.stringify(handler.event));
    validateRequestSchema(JSON.parse(request.body), schema);
  }
};


export const validateClientPkLambdaCallback = () => {
  return async (handler: HandlerLambda, next: NextFunction) => {
    const event = JSON.parse(JSON.stringify(handler.event));
    const headers = event.headers;
    validateClientPk(headers.authorization);
  }
};