import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'cards',
})
export class CardEntity {
  @PrimaryColumn({
    type: 'uuid',
    generated: false,
  })
  id: string;

  @Column()
  card_number: string;

  @Column()
  cvv: string;

  @Column()
  expiration_month: string;

  @Column()
  expiration_year: string;

  @Column()
  email: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true,
  })
  updated_at: Date;
}