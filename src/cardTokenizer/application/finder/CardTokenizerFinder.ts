import { CardTokenizerTokenNotValid } from "../../domain/CardTokenizerTokenNotValid";
import { CardTokenizerRepository } from "../../domain/CardTokenizerRepository";
import { CardTokernizerRedisRepository } from "../../infrastructure/redis/CardTokernizerRedisRepository";
import { FindCardTokenizerResponse } from "./FindCardTokenizerResponse";

export class CardTokenizerFinder {
  private _cardTokenizerRepository: CardTokenizerRepository

  constructor() {
    this._cardTokenizerRepository = new CardTokernizerRedisRepository();
  }

  async run(token: string): Promise<FindCardTokenizerResponse> {
    const cardId = await this._cardTokenizerRepository.findCardIdByToken(token);

    if (!cardId) {
      throw new CardTokenizerTokenNotValid();
    }

    return new FindCardTokenizerResponse(token, cardId);
  }
}