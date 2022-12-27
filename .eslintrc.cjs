module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  parserOptions: {
    // ecmaVersion: 'latest',
    // sourceType: 'module',
    // ecmaFeatures: { jsx: true },
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',

    'plugin:@typescript-eslint/recommended'
    // 'plugin:prettier/recommended'
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  rules: {
    eqeqeq: 'error',
    'no-unused-vars': 'off',

    'no-empty-pattern': 'off',
    '@typescript-eslint/no-unused-vars': 'off'
    // '@typescript-eslint/no-non-null-assertion': 'off',
    // '@typescript-eslint/no-unsafe-assignment': 'off',
  }
}
