/** @type {import('jest').Config} */
const config = {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/', '<rootDir>/libs/'],
  moduleNameMapper: {
    '^~(|/.*)$': '<rootDir>/src/$1',
    '^@app/typeorm-paginate(|/.*)$': '<rootDir>/libs/typeorm-paginate/src/$1',
  },
};

module.exports = config;
