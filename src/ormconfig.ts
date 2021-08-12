import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions'
import { AppConfig } from './config'
import { ConnectionOptions } from 'typeorm-seeding'
import { Entities } from './entities'

const logging  = AppConfig.ENABLE_DEBUGGING_SQL_QUERIES

export const CONNECTION_NAME: string = 'unid-sdk'

export const getConfig = (database: string): SqliteConnectionOptions & ConnectionOptions => {
    return {
        name: CONNECTION_NAME,
        type: 'sqlite',
        database: database,
        logging: logging,
        synchronize: true,
        entities: Entities,
        namingStrategy: new SnakeNamingStrategy(),
        seeds: [ 'src/database/seeds/*.ts' ],
        factories: [ 'src/database/factories/*.ts' ],
    }
}