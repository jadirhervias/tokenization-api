import BaseEntity from "../../shared/domain/BaseEntity";

export type CardTokenizerPrimitives = {
  id: string;
  card_id: string;
  token: string;
  ttl_in_seconds: number;
  created_at: Date;
};

export class CardTokenizer extends BaseEntity {
  id: string;
  cardId: string;
  token: string;
  ttlInSeconds: number;
  createdAt: Date;

  constructor(
    id: string,
    cardId: string,
    token: string,
    ttlInSeconds: number,
    createdAt: Date
  ) {
    super();
    this.id = id;
    this.cardId = cardId;
    this.token = token;
    this.ttlInSeconds = ttlInSeconds;
    this.createdAt = createdAt;
  }

  static create(
    id: string,
    cardId: string,
    token: string,
    ttlInSeconds: number,
    createdAt: Date
  ): CardTokenizer {
    return new CardTokenizer(
      id,
      cardId,
      token,
      ttlInSeconds,
      createdAt
    );
  }

  static fromPrimitives(primitives: CardTokenizerPrimitives): CardTokenizer {
    return new CardTokenizer(
      primitives.id,
      primitives.card_id,
      primitives.token,
      primitives.ttl_in_seconds,
      new Date(primitives.created_at)
    );
  }

  toPrimitives(): Record<string, unknown> {
    return {
      id: this.id,
      card_id: this.cardId,
      token: this.token,
      ttl_in_seconds: this.ttlInSeconds,
      created_at: this.createdAt,
    };
  }
}