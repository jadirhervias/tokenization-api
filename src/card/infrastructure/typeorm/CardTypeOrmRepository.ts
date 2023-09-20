import { CryptManager } from "../../../shared/domain/CryptManager";
import { Nullable } from "../../../shared/domain/types";
import { TypeOrmRepository } from "../../../shared/infrastructure/persistance/typeorm/TypeOrmRepository";
import { Card, CardPrimitives } from "../../domain/Card";
import { CardRepository } from "../../domain/CardRepository";

export class CardTypeOrmRepository extends TypeOrmRepository<Card> implements CardRepository {
  _cryptManager: CryptManager;

  constructor() {
    super();
    this._cryptManager = CryptManager.build().setEncryptionKey(process.env.ENCRYPTION_KEY);
  }

  protected entityTarget(): string {
    return 'CardEntity';
  }

  public async save(card: Card): Promise<void> {
    const data = card.toPrimitives();

    await this.repository().save({
      ...data,
      card_number: this._cryptManager.encryptAES(String(data.card_number)),
      cvv: this._cryptManager.encryptAES(String(data.cvv))
    });
  }

  public async findOneById(id: string): Promise<Nullable<Card>> {
    const record = await this.repository().findOneBy({ id });

    return record ? Card.fromPrimitives({
      ...record,
      card_number: this._cryptManager.decryptAES(String(record.card_number)),
      cvv: this._cryptManager.decryptAES(String(record.cvv))
    } as CardPrimitives) : null;
  }
}