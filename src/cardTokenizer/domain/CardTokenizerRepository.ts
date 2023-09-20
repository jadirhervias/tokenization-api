import { CardTokenizer } from "./CardTokenizer";

export interface CardTokenizerRepository {
  generate(cardTokenizer: CardTokenizer): Promise<void>;
  delete(cardId: string): Promise<void>;
  findCardIdByToken(token: string): Promise<string>;
  alreadyExists(cardId: string): Promise<boolean>;
}