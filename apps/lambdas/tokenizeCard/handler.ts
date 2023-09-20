import middy from "middy";
import { CardCreator } from "../../../src/card/application/register/CardCreator";
import { CardTokenizerCreator } from "../../../src/cardTokenizer/application/create/CardTokenizerCreator";
import { TokenizationApp } from "../../TokenizationApp";
import { lambdaErrorHandler } from "../lambdaErrorHandler";
import { zCreateCardTokenizerSchema } from "../../schemas";
import { validateClientPkLambdaCallback, validateRequestSchemaLambdaCallback } from "../middlewares";

const handler = middy(async (payload: Object, context: Object, callback: Function) => {
  // Init application
  const app = new TokenizationApp();
  await app.startDatabaseConnection();
  await app.startRedisConnection();

  const body = JSON.parse((payload as any)['body']);

  // Card registration
  const cardCreator = new CardCreator();
  const cardRegistrarResponse = await cardCreator.run(body);

  // Card token generation
  const cardTokenizer = new CardTokenizerCreator();
  const cardTokenizerResponse = await cardTokenizer.run({
    card_id: cardRegistrarResponse.toPrimitives().card_id as string
  });

  return {
    success: true,
    message: 'Token generated successfully.',
    data: cardTokenizerResponse.toPrimitives(),
  };
});

handler.before(validateClientPkLambdaCallback());
handler.before(validateRequestSchemaLambdaCallback(zCreateCardTokenizerSchema));
handler.onError(lambdaErrorHandler());

export { handler };