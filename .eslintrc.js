// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  env: {
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  extends: ['expo', 'prettier', 'plugin:@typescript-eslint/recommended'],
  plugins: ['prettier', '@typescript-eslint'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // Intenta resolver los types que están en node_modules/@types
      },
    },
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
    'max-len': ['error', { code: 140, ignoreComments: true }],
  },
};
