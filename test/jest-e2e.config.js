/** @type {import('jest').Config} */
const config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^~(|/.*)$': '<rootDir>/../src/$1',
    '^@app/typeorm-paginate(|/.*)$': '<rootDir>/../libs/typeorm-paginate/src/$1',
  },
};
module.exports = config;
