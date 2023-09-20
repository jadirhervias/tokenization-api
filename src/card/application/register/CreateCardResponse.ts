export class CreateCardResponse {
  readonly cardId: string;
  readonly cardNumber: string;
  readonly expirationMonth: string;
  readonly expirationYear: string;
  readonly email: string;

  constructor(
    cardId: string,
    cardNumber: string,
    expirationMonth: string,
    expirationYear: string,
    email: string
  ) {
    this.cardId = cardId;
    this.cardNumber = cardNumber;
    this.expirationMonth = expirationMonth;
    this.expirationYear = expirationYear;
    this.email = email;
  }

  toPrimitives(): Record<string, unknown> {
    return {
      card_id: this.cardId,
      card_number: this.cardNumber,
      expiration_month: this.expirationMonth,
      expiration_year: this.expirationYear,
      email: this.email,
    }
  }
}