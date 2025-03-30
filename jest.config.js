module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "**/__test__/**/*.test.ts"
  ],
  transform: {
    "^.+\\.tsx?$": ['ts-jest', {
      tsconfig: 'tsconfig.json',
      // エラーのログレベルを調整
      diagnostics: {
        warnOnly: true  // エラーを警告として扱い、テスト実行を継続
      }
      // isolatedModulesオプションを削除
    }]
  },
  moduleNameMapper: {
    '^@jest/globals$': '<rootDir>/node_modules/@jest/globals'
  },
  // テスト前に実行するセットアップファイル
  setupFilesAfterEnv: [
    // '<rootDir>/__test__/setup.ts'  // 必要に応じてコメントを解除
  ]
};