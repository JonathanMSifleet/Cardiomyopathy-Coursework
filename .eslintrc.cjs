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
    'comma-dangle': [
      'error',
      'never'
    ],
    'eol-last': [2, 'windows'],
    'func-style': ['error', 'expression'],
    indent: ['error', 2, { 'SwitchCase': 1 }],
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
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'prefer-arrow/prefer-arrow-functions': [
      'error', {
        'disallowPrototype': true,
        'singleReturnOnly': false,
        'classPropertiesAllowed': false
      }],
    'quotes': [
      'error',
      'single'
    ],
    semi: ['error', 'always'],
    'vue/html-indent': ['error', 2, {
      baseIndent: 1
    }],
    'vue/max-attributes-per-line': ['error', {
      'singleline': {
        'max': 3
      },
      'multiline': {
        'max': 1
      }
    }],
    'vue/script-indent': [
      'error',
      2,
      { baseIndent: 1 }
    ]
  },
  extends: [
    'plugin:vue/base',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'plugin:import/recommended'
  ],
  "plugins": [
    "prefer-arrow"
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
