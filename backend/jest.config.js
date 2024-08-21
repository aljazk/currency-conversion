module.exports = {
  testEnvironment: 'node',
  verbose: true,
  coverageDirectory: './coverage',
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
