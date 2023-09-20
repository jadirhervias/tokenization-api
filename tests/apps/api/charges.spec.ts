import request from "supertest";
import httpStatus from "http-status";
import { TokenizationApp } from '../../../apps/TokenizationApp';
import { CardTokenizerCreator } from "../../../src/cardTokenizer/application/create/CardTokenizerCreator";
import { CardCreator } from "../../../src/card/application/register/CardCreator";

describe('POST /charges', () => {
  let app: TokenizationApp;
  process.env.DATABASE_HOST = 'localhost';
  process.env.DATABASE_NAME = 'postgres';
  process.env.REDIS_URL = 'redis://localhost:6379'
  process.env.PORT = '4000';
  process.env.ENCRYPTION_KEY = 'test123';
  const TEST_PK = 'pk_test_LsRBKejzCOEEWOsw';
  const TEST_EXPECTED_CARD_RESPONSE = {
    card_number: "4111111111111111",
    expiration_month: "10",
    expiration_year: "2024",
    email: "test@gmail.com",
  };
  const TEST_CARD_REQUEST = {
    ...TEST_EXPECTED_CARD_RESPONSE,
    cvv: 111,
  };

  beforeAll(async () => {
    app = new TokenizationApp();
    await app.start();
  });

  afterAll(async () => {
    await app.stop();
  });

  it('should return 200 OK', async () => {
    // Create card tokenizer for test
    const cardCreator = new CardCreator();
    const cardCreatorResponse = await cardCreator.run(TEST_CARD_REQUEST);

    const cardTokenizer = new CardTokenizerCreator();
    const cardTokenizerResponse = await cardTokenizer.run({
      card_id: cardCreatorResponse.cardId,
    });

    const response = await request(app.httpServer)
      .post('/charges')
      .send({
        token: cardTokenizerResponse.token,
      })
      .set('Authorization', `Bearer ${TEST_PK}`);

    expect({
      ...response.body,
      data: TEST_EXPECTED_CARD_RESPONSE,
    }).toStrictEqual({
      success: true,
      message: "Card data found.",
      data: TEST_EXPECTED_CARD_RESPONSE,
    })

    expect(response.status).toEqual(httpStatus.OK);
  });
});