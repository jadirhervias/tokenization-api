import { KeyGenerator, KeyGeneratorTypes } from "../../../shared/domain/KeyGenerator";
import { Uuid } from "../../../shared/domain/Uuid";
import { CardTokenizer } from "../../domain/CardTokenizer";
import { CardTokenizerRepository } from "../../domain/CardTokenizerRepository";
import { CardTokernizerRedisRepository } from "../../infrastructure/redis/CardTokernizerRedisRepository";
import { CreateCardTokenizerRequest } from "./CreateCardTokenizerRequest";
import { CreateCardTokenizerResponse } from "./CreateCardTokenizerResponse";

export class CardTokenizerCreator {
  private _cardTokenizerRepository: CardTokenizerRepository

  constructor() {
    this._cardTokenizerRepository = new CardTokernizerRedisRepository();
  }

  async run(request: CreateCardTokenizerRequest): Promise<CreateCardTokenizerResponse> {
    const token = KeyGenerator.random(KeyGeneratorTypes.ALPHANUMERIC, 16)._value;

    const cardTokenizer = CardTokenizer.create(
      Uuid.random().value,
      request.card_id,
      token,
      1 * 15 * 60,
      new Date()
    );

    await this._cardTokenizerRepository.generate(cardTokenizer);

    return new CreateCardTokenizerResponse(token);
  }
}