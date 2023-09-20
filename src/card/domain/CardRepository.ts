import { Nullable } from '../../shared/domain/types';
import { Card } from './Card';

export interface CardRepository {
  save(card: Card): Promise<void>;
  findOneById(id: string): Promise<Nullable<Card>>;
}