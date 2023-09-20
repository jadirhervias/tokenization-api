import BaseEntity from "../../shared/domain/BaseEntity";

export type CardPrimitives = {
  id: string;
  card_number: string;
  cvv: number | string;
  expiration_month: string;
  expiration_year: string;
  email: string;
  created_at?: Date | string;
  updated_at?: Date | string;
};

export class Card extends BaseEntity {
  id: string;
  cardNumber: string;
  cvv: number;
  expirationMonth: string;
  expirationYear: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    cardNumber: string,
    cvv: number,
    expirationMonth: string,
    expirationYear: string,
    email: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    super();
    this.id = id;
    this.cardNumber = cardNumber;
    this.cvv = cvv;
    this.expirationMonth = expirationMonth;
    this.expirationYear = expirationYear;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    id: string,
    cardNumber: string,
    cvv: number,
    expirationMonth: string,
    expirationYear: string,
    email: string,
    createdAt: Date,
    updatedAt: Date
  ): Card {
    return new Card(
      id,
      cardNumber,
      cvv,
      expirationMonth,
      expirationYear,
      email,
      createdAt,
      updatedAt
    );
  }

  static fromPrimitives(primitives: CardPrimitives): Card {
    return new Card(
      primitives.id,
      primitives.card_number,
      Number(primitives.cvv),
      primitives.expiration_month,
      primitives.expiration_year,
      primitives.email,
      new Date(primitives.created_at),
      new Date(primitives.updated_at)
    );
  }

  toPrimitives(): Record<string, unknown> {
    return {
      id: this.id,
      card_number: this.cardNumber,
      cvv: this.cvv,
      expiration_month: this.expirationMonth,
      expiration_year: this.expirationYear,
      email: this.email,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}