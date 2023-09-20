import { z } from 'zod';
import { IncomingMessage, ServerResponse } from "http";
import httpStatus from "http-status";
import { CardCreator } from "../../src/card/application/register/CardCreator";
import { CardTokenizerCreator } from "../../src/cardTokenizer/application/create/CardTokenizerCreator";
import { CardTokenizerFinder } from "../../src/cardTokenizer/application/finder/CardTokenizerFinder";
import { CardFinder } from "../../src/card/application/finder/CardFinder";
import { RouteNotFoundError } from "../RouteNotFoundError";
import { getJsonBody } from "./utils";
import { RequestSchemaValidationFailed } from '../RequestSchemaValidationFailed';
import { validateRequestSchema } from '../middlewares/validateRequestSchema';
import { zCreateCardTokenizerSchema, zRetrieveCardDataSchema } from '../schemas';
import { validateClientPk } from '../middlewares/validateClientPk';
import { PkAuthenticationFailed } from '../PkAuthenticationFailed';

type RouteType = {
  method: string,
  pathname: string,
  requestValidatorSchema: z.ZodSchema,
  controller: (req: RequestContext, res: ServerResponse) => Promise<void>,
};

type RequestContext = {
  request: IncomingMessage,
  safeIncomingData: Record<string, unknown>,
};

const ROUTES: RouteType[] = [
  {
    method: 'POST',
    pathname: '/tokens',
    requestValidatorSchema: zCreateCardTokenizerSchema,
    controller: async (req: RequestContext, res: ServerResponse) => {
      const cardCreator = new CardCreator();
      const cardCreatorResponse = await cardCreator.run(req.safeIncomingData as any);

      const cardTokenizer = new CardTokenizerCreator();
      const cardTokenizerResponse = await cardTokenizer.run({
        card_id: cardCreatorResponse.toPrimitives().card_id as string
      });

      res.statusCode = httpStatus.CREATED;
      res.end(JSON.stringify({
        success: true,
        message: 'Token generated successfully.',
        data: cardTokenizerResponse.toPrimitives(),
      }));

      return;
    }
  },
  {
    method: 'POST',
    pathname: '/charges',
    requestValidatorSchema: zRetrieveCardDataSchema,
    controller: async (req: RequestContext, res: ServerResponse) => {
      const body = req.safeIncomingData as any;
      const token = body['token'] as string;

      const cardTokenizer = new CardTokenizerFinder();
      const cardTokenizerResponse = await cardTokenizer.run(token);

      const cardFinder = new CardFinder();
      const cardFinderResponse = await cardFinder.run(cardTokenizerResponse.toPrimitives().card_id as string);

      res.statusCode = httpStatus.OK;
      res.end(JSON.stringify({
        success: true,
        message: 'Card data found.',
        data: cardFinderResponse.toPrimitives(),
      }));

      return;
    }
  }
]

export async function initRouter(req: IncomingMessage, res: ServerResponse) {
  for (const route of ROUTES) {
    if (route.pathname !== req.url.split('?')[0]) continue;
    if (route.method !== req.method) continue;

    await controllerHandler(req, res, route);

    return;
  }

  throw new RouteNotFoundError();
}

async function controllerHandler(req: IncomingMessage, res: ServerResponse, route: RouteType) {
  try {
    validateClientPk(req.headers.authorization);
    const requestBody = await getJsonBody(req);
    const safeData = validateRequestSchema(requestBody, route.requestValidatorSchema);
    await route.controller({ request: req, safeIncomingData: safeData }, res);
  } catch (error) {
    if (error instanceof RequestSchemaValidationFailed) {
      console.error(`[RequestSchemaError - ${route.pathname}] `, JSON.stringify(error.errors()));

      res.statusCode = httpStatus.BAD_REQUEST;
      res.end(JSON.stringify({
        success: false,
        message: error.message,
        error: error.errors(),
      }));

      return;
    }

    if (error instanceof PkAuthenticationFailed) {
      console.error(`[PkAuthenticationFailed - ${route.pathname}] `, JSON.stringify(error));

      res.statusCode = httpStatus.UNAUTHORIZED;
      res.end(JSON.stringify({
        success: false,
        message: error.message,
        error,
      }));

      return;
    }

    console.error(`[Unexpected Error - ${route.pathname}] `, JSON.stringify(error));
    res.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    res.end(JSON.stringify({
      success: false,
      message: error instanceof Error
        ? error.message
        : 'Hubo un error inesperado.',
      error,
    }));
  }
}