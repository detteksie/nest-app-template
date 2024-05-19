const { ormconfig } = require('./dataSource');

const newOrmconfig = () => {
  if (ormconfig.entities) {
    const { entities: _, ...config } = ormconfig;
    return config;
  }
  return ormconfig;
};

const ormcfg = newOrmconfig();

module.exports = ormcfg;
