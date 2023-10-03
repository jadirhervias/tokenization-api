import middy from "middy";
import { CardTokenizerFinder } from "../../../../src/cardTokenizer/application/finder/CardTokenizerFinder";
import { CardFinder } from "../../../../src/card/application/finder/CardFinder";
import { TokenizationApp } from "../../TokenizationApp";
import { zRetrieveCardDataSchema } from "../../schemas";
import { lambdaErrorHandler } from "../lambdaErrorHandler";
import { validateClientPkLambdaCallback, validateRequestSchemaLambdaCallback } from "../middlewares";

const handler = middy(async (payload: Object, context: Object, callback: Function) => {
  // Init application
  const app = new TokenizationApp();
  await app.startDatabaseConnection();
  await app.startRedisConnection();

  const token = JSON.parse((payload as any)['body'])['token'] as string;

  // Validate token existance
  const cardTokenizer = new CardTokenizerFinder();
  const cardTokenizerResponse = await cardTokenizer.run(token);

  // Get card data
  const cardFinder = new CardFinder();
  const cardFinderResponse = await cardFinder.run(cardTokenizerResponse.cardId);

  return {
    success: true,
    message: 'Card data found.',
    data: cardFinderResponse.toPrimitives(),
  };
});

handler.before(validateClientPkLambdaCallback());
handler.before(validateRequestSchemaLambdaCallback(zRetrieveCardDataSchema));
handler.onError(lambdaErrorHandler());

export { handler };