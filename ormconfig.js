const { ormconfig } = require('./dataSource');

module.exports = (() => {
  if (ormconfig.entities) {
    const { entities: _, ...config } = ormconfig;
    return config;
  }
  return ormconfig;
})();
