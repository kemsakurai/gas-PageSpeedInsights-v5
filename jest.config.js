module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__test__/**/*.test.ts'], // __test__ディレクトリを正しく参照
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  globals: {
    SpreadsheetApp: {},
    Logger: {}
  }
};
