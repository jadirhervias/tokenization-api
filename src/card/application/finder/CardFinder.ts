import { CardNotExists } from "../../domain/CardNotExists";
import { CardRepository } from "../../domain/CardRepository";
import { CardTypeOrmRepository } from "../../infrastructure/typeorm/CardTypeOrmRepository";
import { FindCardResponse } from "./FindCardResponse";

export class CardFinder {
  private _cardRepository: CardRepository;

  constructor() {
    this._cardRepository = new CardTypeOrmRepository();
  }

  async run(cardId: string): Promise<FindCardResponse> {
    const card = await this._cardRepository.findOneById(cardId);

    if (!card) {
      throw new CardNotExists(cardId);
    }

    return new FindCardResponse(card);
  }
}