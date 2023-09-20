import { Uuid } from "../../../shared/domain/Uuid";
import { Card } from "../../domain/Card";
import { CardRepository } from "../../domain/CardRepository";
import { CardTypeOrmRepository } from "../../infrastructure/typeorm/CardTypeOrmRepository";
import { CreateCardRequest } from "./CreateCardRequest";
import { CreateCardResponse } from "./CreateCardResponse";

export class CardCreator {
  private _cardRepository: CardRepository;

  constructor() {
    this._cardRepository = new CardTypeOrmRepository();
  }

  async run(request: CreateCardRequest): Promise<CreateCardResponse> {
    const card = Card.create(
      Uuid.random().value,
      request.card_number,
      request.cvv,
      request.expiration_month,
      request.expiration_year,
      request.email,
      new Date(),
      new Date()
    );

    await this._cardRepository.save(card);

    return new CreateCardResponse(
      card.id,
      card.cardNumber,
      card.expirationMonth,
      card.expirationYear,
      card.email
    );
  }
}