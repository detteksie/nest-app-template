/**
 * @typedef {'development' | 'test' | 'production'} OrmconfigKeys
 */

const { DataSource } = require('typeorm');

/**
 * type {{ [key in OrmconfigKeys]: import("typeorm").ConnectionOptions } }
 * @type {{ [key in OrmconfigKeys]: import("typeorm").DataSourceOptions } }
 */
const ormconfigObject = {
  development: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: true,
    entities: ['src/**/*.entity.ts'],
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
const ormconfig = ormconfigObject[process.env.NODE_ENV || 'development'];
// console.log('ormconfig', ormconfig);
exports.ormconfig = ormconfig;

const dataSource = new DataSource(ormconfig);
// console.log('dataSource', dataSource);
exports.default = dataSource;
