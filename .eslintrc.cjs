module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest', sourceType: 'module',
  },
  plugins: ['import'],
  rules: {
    'import/order': ['error', {
      'newlines-between': 'always',
    }],
    'no-unused-vars': 'error',
  },
}