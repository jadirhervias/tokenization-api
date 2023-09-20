import { Repository, DataSource, ObjectLiteral } from 'typeorm';
import BaseEntity from '../../../domain/BaseEntity';
import { TypeOrmDataSourceFactory } from './TypeOrmDataSourceFactory';

export abstract class TypeOrmRepository<T extends BaseEntity> {
  private _dataSource?: DataSource;

  constructor() {
    this._dataSource = TypeOrmDataSourceFactory.getDataSource();
  }

  protected abstract entityTarget(): string;

  protected dataSource(): DataSource {
    return this._dataSource;
  }

  protected repository(): Repository<ObjectLiteral> {
    return this._dataSource.getRepository(this.entityTarget());
  }

  protected async persist(model: T): Promise<void> {
    const data = model.toPrimitives();
    await this.repository().save(data);
  }

  public async findByCondition(filterCondition: any): Promise<ObjectLiteral> {
    return await this.repository().findOne({ where: filterCondition });
  }

  public async findAll(): Promise<ObjectLiteral[]> {
    return await this.repository()
      .createQueryBuilder()
      .orderBy({ updated_at: 'DESC' })
      .getMany();
  }

  public async remove(id: string): Promise<void> {
    await this.repository().delete(id);
  }
}