import request from "supertest";
import httpStatus from "http-status";
import { app } from '../utils/hooks';

let testCardToken: string;
const TEST_PK = 'pk_test_LsRBKejzCOEEWOsw';
const TEST_CVV = 111;
const TEST_CARD_DATA = {
  card_number: "4111111111111111",
  expiration_month: "10",
  expiration_year: "2025",
  email: "test@gmail.com",
};

describe('POST /tokens', () => {
  it('should return 201 CREATED', async () => {
    const response = await request(app.httpServer)
      .post('/tokens')
      .send({
        ...TEST_CARD_DATA,
        cvv: TEST_CVV,
      })
      .set('Authorization', `Bearer ${TEST_PK}`);

    testCardToken = response.body.data.token;

    expect({
      ...response.body,
      data: {
        token: testCardToken,
      },
    }).toStrictEqual({
      success: true,
      message: "Token generated successfully.",
      data: {
        token: testCardToken,
      },
    })

    expect(response.status).toEqual(httpStatus.CREATED);
  });
});

describe('POST /charges', () => {
  it('should return 200 OK', async () => {
    const response = await request(app.httpServer)
      .post('/charges')
      .send({
        token: testCardToken,
      })
      .set('Authorization', `Bearer ${TEST_PK}`);

    expect({
      ...response.body,
      data: TEST_CARD_DATA,
    }).toStrictEqual({
      success: true,
      message: "Card data found.",
      data: TEST_CARD_DATA,
    })

    expect(response.status).toEqual(httpStatus.OK);
  });
});