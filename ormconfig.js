/**
 * @typedef {'undefined' | 'development' | 'test' | 'production'} OrmconfigKeys
 */

/**
 * type {{ [key in OrmconfigKeys]: import("typeorm").ConnectionOptions } }
 * @type {{ [key in OrmconfigKeys]: import("typeorm").DataSourceOptions } }
 */
const ormconfigObject = {
  undefined: {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false,
    logging: true,
    entities: ['src/entities/*.entity.ts'],
    migrations: ['src/migrations/*.ts'],
    cli: {
      migrationsDir: 'src/migrations',
    },
  },
  development: {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false,
    logging: true,
    cli: {
      migrationsDir: 'build/migrations',
    },
  },
  test: {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false,
    logging: false,
    cli: {
      migrationsDir: 'src/migrations',
    },
  },
  production: {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false,
    logging: false,
    migrations: ['build/migrations/*.js'],
    cli: {
      migrationsDir: 'build/migrations',
    },
  },
};

const ormconfig = ormconfigObject[process.env.NODE_ENV];

// export default ormconfig;
module.exports = ormconfig;
