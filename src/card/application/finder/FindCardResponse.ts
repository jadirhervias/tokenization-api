import { Card } from "../../domain/Card";

export class FindCardResponse {
  constructor(private card: Card) {
  }

  toPrimitives(): Record<string, unknown> {
    return {
      card_number: this.card.cardNumber,
      expiration_month: this.card.expirationMonth,
      expiration_year: this.card.expirationYear,
      email: this.card.email,
    };
  }
}