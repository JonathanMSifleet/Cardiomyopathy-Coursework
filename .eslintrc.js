module.exports = {
  root: true,
  env: {
    node: true
  },
  parserOptions: {
    extraFileExtensions: ['.vue'],
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    indent: ['error', 2],
    'vue/script-indent': [
      'error',
      2,
      { baseIndent: 1 }
    ],
    'eol-last': [2, 'windows'],
    'linebreak-style': [
      'error',
      'windows'
    ],
    'max-len': [
      'error',
      {
        code: 100
      }
    ],
    quotes: [
      'error',
      'single'
    ],
    'comma-dangle': [
      'error',
      'never'
    ],
    'vue/html-indent': ['error', 2, {
      baseIndent: 1
    }]
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'off'
      }
    }
  ]
};
