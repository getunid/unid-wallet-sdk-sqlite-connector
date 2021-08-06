import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions'
import { AppConfig } from './src/config'
import { ConnectionOptions } from 'typeorm-seeding'
import { Entities } from './src/entities'

const database = AppConfig.DATABASE_PATH
const logging  = AppConfig.ENABLE_DEBUGGING_SQL_QUERIES

const config: SqliteConnectionOptions & ConnectionOptions = {
    type: 'sqlite',
    database: database,
    logging: logging,
    synchronize: true,
    entities: Entities,
    namingStrategy: new SnakeNamingStrategy(),
    seeds: [ 'src/database/seeds/*.ts' ],
    factories: [ 'src/database/factories/*.ts' ],
}

export default config