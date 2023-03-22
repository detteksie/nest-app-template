/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @typedef {'undefined' | 'development' | 'test' | 'production'} OrmconfigKeys
 */

const { DataSource } = require('typeorm');

/**
 * type {{ [key in OrmconfigKeys]: import("typeorm").ConnectionOptions } }
 * @type {{ [key in OrmconfigKeys]: import("typeorm").DataSourceOptions } }
 */
const ormconfigObject = {
  undefined: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: true,
    entities: ['src/**/*.entity.ts'],
    migrations: ['migrations/*.js'],
  },
  development: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: true,
    migrations: ['migrations/*.js'],
  },
  test: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: false,
    migrations: ['migrations/*.js'],
  },
  production: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: false,
    migrations: ['migrations/*.js'],
  },
};

/**
 * @type {import("typeorm").DataSourceOptions}
 */
const ormconfig = ormconfigObject[process.env.NODE_ENV];
// console.log('ormconfig', ormconfig);
exports.ormconfig = ormconfig;

const dataSource = new DataSource(ormconfig);
// console.log('dataSource', dataSource);
exports.default = dataSource;
