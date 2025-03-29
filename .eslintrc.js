module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json', './__test__/tsconfig.test.json'],
    tsconfigRootDir: __dirname,
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-argument': 'error',
    '@typescript-eslint/no-unsafe-return': 'error'
  },
  ignorePatterns: ['dist/', 'node_modules/', 'jest.config.js'],
  overrides: [
    {
      files: ['./__test__/**/*.ts'],
      parserOptions: {
        project: ['./__test__/tsconfig.test.json'],
      },
      rules: {
        // テスト用の緩和ルール
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off'
      }
    },
    {
      files: ['./__test__/jest.d.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
};
