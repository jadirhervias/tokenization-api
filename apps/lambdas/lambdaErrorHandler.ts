import { HandlerLambda, NextFunction } from 'middy';
import { PkAuthenticationFailed } from "../PkAuthenticationFailed";
import { RequestSchemaValidationFailed } from "../RequestSchemaValidationFailed";

export const lambdaErrorHandler = () => async (handler: HandlerLambda, next: NextFunction) => {
  const request = JSON.parse(JSON.stringify(handler.event));

  if (handler.error instanceof RequestSchemaValidationFailed) {
    console.error(`[RequestSchemaValidationFailed - ${request.rawPath}] `, JSON.stringify(handler.error.errors()));

    return Promise.reject(JSON.stringify({
      success: false,
      message: handler.error.message,
      error: handler.error.errors(),
    }));
  }

  if (handler.error instanceof PkAuthenticationFailed) {
    console.error(`[PkAuthenticationFailed - ${request.rawPath}] `, handler.error);

    return Promise.reject(JSON.stringify({
      success: false,
      message: handler.error.message,
      error: handler.error,
    }));
  }

  console.error(`[UnexpectedError - ${request.rawPath}] `, handler.error);

  return Promise.reject(JSON.stringify({
    success: false,
    message: handler.error instanceof Error
      ? handler.error.message
      : 'Hubo un error inesperado.',
    error: handler.error,
  }));
};