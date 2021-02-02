module.exports = {
  root: true,
  env: {
    commonjs: true,
    browser: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-eval': 'error',
    'import/first': 'error',
    'consistent-return': [0, { treatUndefinedAsUnspecified: true }],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  overrides: [
    Object.assign(
      {
        files: ['**/*.spec.js'],
        env: { jest: true },
        plugins: ['jest'],
      },
      require('eslint-plugin-jest').configs.recommended,
    ),
  ],
};
