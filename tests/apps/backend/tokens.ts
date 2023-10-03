import request from "supertest";
import httpStatus from "http-status";
import { app } from '../utils/hooks';

describe('POST /tokens', () => {
  process.env.DATABASE_HOST = 'localhost';
  process.env.DATABASE_NAME = 'postgres';
  process.env.REDIS_URL = 'redis://localhost:6379'
  process.env.PORT = '4000';
  process.env.ENCRYPTION_KEY = 'test123';
  const TEST_TOKEN = 'tcH836CIiuQPq1UN';
  const TEST_PK = 'pk_test_LsRBKejzCOEEWOsw';

  it('should return 201 CREATED', async () => {
    const response = await request(app.httpServer)
      .post('/tokens')
      .send({
        card_number: "4111111111111111",
        cvv: 111,
        expiration_month: "10",
        expiration_year: "2024",
        email: "test@gmail.com",
      })
      .set('Authorization', `Bearer ${TEST_PK}`);

    expect({
      ...response.body,
      data: {
        token: TEST_TOKEN,
      },
    }).toStrictEqual({
      success: true,
      message: "Token generated successfully.",
      data: {
        token: TEST_TOKEN,
      },
    })

    expect(response.status).toEqual(httpStatus.CREATED);
  });
});