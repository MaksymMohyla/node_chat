module.exports = {
  extends: [
    '@mate-academy/eslint-config',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json', // якщо використовуєте TypeScript з конфігурацією
  },

  env: {
    jest: true,
  },
  rules: {
    'no-proto': 0,
  },
  plugins: ['jest', '@typescript-eslint'],
};
