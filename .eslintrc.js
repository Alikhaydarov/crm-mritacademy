module.exports = {
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  parser: '@babel/eslint-parser',
  extends: ['next/core-web-vitals', 'prettier'],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
    project: './jsconfig.json',
    ecmaFeatures: {
      jsx: true,
      modules: true,
      experimentalObjectRestSpread: true,
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }], // Add .ts and .tsx here
    'react/display-name': 'off',
    '@next/next/no-img-element': 'off',
    'react/no-unescaped-entities': 'off',
    'import/no-anonymous-default-export': 'off',

    // Add new line above comment
    'lines-around-comment': [
      'error',
      {
        beforeLineComment: true,
        beforeBlockComment: true,
        allowBlockStart: true,
        allowClassStart: true,
        allowObjectStart: true,
        allowArrayStart: true,
      },
    ],

    // Add new line above return
    'newline-before-return': 'error',

    // Add new line below import
    'import/newline-after-import': [
      'error',
      {
        count: 1,
      },
    ],

    // Add new line after each var, const, let declaration
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: ['export'], next: ['*'] },
      { blankLine: 'always', prev: ['*'], next: ['multiline-const', 'multiline-let', 'multiline-var', 'export'] },
      { blankLine: 'always', prev: ['*'], next: ['return'] },
    ],

    // Suppress console-related warnings
    'no-console': 'warn', // Warn about console statements
    'no-debugger': 'warn', // Warn about debugger statements
  },
};
