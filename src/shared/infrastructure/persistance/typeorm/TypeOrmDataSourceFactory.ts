import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Nullable } from '../../../domain/types';

export class TypeOrmDataSourceFactory {
  private static dataSource: Nullable<DataSource> = null;

  static async createDataSource(connectionUri: string, databaseName: string): Promise<DataSource> {
    let dataSource = TypeOrmDataSourceFactory.getDataSource();

    if (!dataSource) {
      dataSource = await TypeOrmDataSourceFactory.createAndInitializeDataSource(connectionUri, databaseName);
      this.dataSource = dataSource;
    }

    return dataSource;
  }

  static async closeConnection(): Promise<void> {
    const dataSource = TypeOrmDataSourceFactory.dataSource;
    if (dataSource) {
      await dataSource.destroy();
      this.dataSource = null;
      console.log(`TypeORM data source and removed.`);
    }
  }

  static getDataSource(): Nullable<DataSource> {
    return TypeOrmDataSourceFactory.dataSource;
  }

  private static async createAndInitializeDataSource(databaseHost: string, databaseName: string): Promise<DataSource> {
    try {
      const dataSource = new DataSource({
        type: 'postgres',
        host: databaseHost,
        port: 5432,
        username: 'postgres',
        database: databaseName,
        entities: [`${__dirname}/entities/*.entity.{ts,js}`],
        synchronize: true,
        logging: false,
      });

      await dataSource.initialize();

      console.log('TypeORM data source created.');

      return dataSource;
    } catch (error) {
      console.error('[TypeOrm Connection Error]', error);
      throw new Error('TypeOrm connection failed.');
    }
  }
}