import { Nullable } from "../../../shared/domain/types";
import { RedisRepository } from "../../../shared/infrastructure/persistance/redis/RedisRepository";
import { CardTokenizer } from "../../domain/CardTokenizer";
import { CardTokenizerRepository } from "../../domain/CardTokenizerRepository";

export class CardTokernizerRedisRepository extends RedisRepository implements CardTokenizerRepository {
  protected keyPrefix(): string {
    return 'card_tokenizer';
  }

  async generate(cardTokenizer: CardTokenizer): Promise<void> {
    await this.savePrimitive(
      cardTokenizer.token,
      cardTokenizer.cardId,
      cardTokenizer.ttlInSeconds
    );
  }

  async delete(cardId: string): Promise<void> {
    await this.remove(cardId);
  }

  async findCardIdByToken(token: string): Promise<Nullable<string>> {
    return await this.get(token);
  }

  async alreadyExists(cardId: string): Promise<boolean> {
    return await this.exists(cardId);
  }
}