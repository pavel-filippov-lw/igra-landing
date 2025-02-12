const ts = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const importXPlugin = require('eslint-plugin-import-x');
const reactRefreshPlugin = require('eslint-plugin-react-refresh');
const simpleImportSortPlugin = require('eslint-plugin-simple-import-sort');
const unusedImportsPlugin = require('eslint-plugin-unused-imports');
const reactPlugin = require('eslint-plugin-react');

module.exports = [{
  files: ['**/*.ts','**/*.tsx'],
  ignores: ['dist', 'scripts/*', '*.cjs', '*.d.ts', '*.mjs', 'vite.config.ts', 'lingui.config.ts', '.storybook/*'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      project: './tsconfig.json',
      sourceType: 'module',
      tsconfigRootDir: __dirname,
      ecmaFeatures: {
        jsx: true,
      },
    }
  },
  settings: {
    react: {
      // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // It will default to "latest" and warn if missing, and to "detect" in the future
      version: 'detect', 
    },
    linkComponents: [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      { name: 'Link', linkAttribute: ['to', 'href'] }, // allows specifying multiple properties if necessary
    ]
  },
  plugins: {
    '@typescript-eslint': ts,
    ts,
    react: reactPlugin,
    'import-x': importXPlugin,
    'react-refresh': reactRefreshPlugin,
    'simple-import-sort': simpleImportSortPlugin,
    'unused-imports': unusedImportsPlugin,
    // '@tanstack/query': queryPlugin,
  },
  rules: {
    ...ts.configs['eslint-recommended'].rules,
    ...ts.configs['recommended'].rules,
    // TODO: uncomment when plugin react is available https://github.com/eslint/eslint/issues/18391
    // ...reactPlugin.configs['recommended'].rules,
    // ...reactPlugin.configs['jsx-runtime'].rules,

    // throwing an error
    // ...queryPlugin.configs['recommended'].rules,

    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    // import
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'unused-imports/no-unused-imports': 'error',
    'import-x/first': 'error',
    'import-x/newline-after-import': 'error',
    'import-x/no-duplicates': 'error',
    'import-x/no-unresolved': 'off',
    'import-x/order': 'off',
    'import-x/extensions': 'off',
    'import-x/no-amd': 'error',
    'import-x/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        peerDependencies: true,
        optionalDependencies: false,
      },
    ],
    'import-x/no-mutable-exports': 'error',
    'import-x/no-named-default': 'error',
    'import-x/no-named-export': 'off',
    'import-x/no-self-import': 'error',
    'import-x/prefer-default-export': 'off',

    // typescript
    '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
    '@typescript-eslint/return-await': ['error', 'in-try-catch'],
    '@typescript-eslint/indent': ['warn', 2],
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/object-curly-spacing': ['error', 'always'],
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/lines-between-class-members': ['error', 'always'],
    '@typescript-eslint/comma-spacing': 'error',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/space-infix-ops': 'error',
    '@typescript-eslint/keyword-spacing': 'error',

    //react-hooks
    'react-hooks/exhaustive-deps': 'off',

    // react
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-tag-spacing': 'error',
    'react/jsx-max-props-per-line': [
      'error',
      {
        maximum: {
          single: 3,
          multi: 1,
        },
      },
    ],
    'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
    'react/jsx-sort-props': [
      'warn',
      {
        callbacksLast: true,
        shorthandFirst: true,
        multiline: 'last',
        reservedFirst: true,
        noSortAlphabetically: true,
      },
    ],
    'react/jsx-indent': [
      'error',
      2,
      {
        indentLogicalExpressions: true,
      },
    ],
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-closing-tag-location': 'error',
    'react/jsx-closing-bracket-location': 'error',
    'react/jsx-wrap-multilines': [
      'error',
      {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'ignore',
      },
    ],
    'react/jsx-one-expression-per-line': [
      'warn',
      {
        allow: 'single-child',
      },
    ],
    'react/jsx-boolean-value': ['error', 'never'],
    'react/jsx-no-useless-fragment': [
      'warn',
      {
        allowExpressions: true,
      },
    ],
    'react/self-closing-comp': [
      'warn',
      {
        component: true,
        html: true,
      },
    ],
    'react/display-name': 'off',
    'react/jsx-curly-brace-presence': ['error', 'never'],
    'react/jsx-key': 'error',

    // other
    'max-len': [
      'warn',
      {
        code: 140,
        ignoreStrings: true,
        ignorePattern: '^\\s*var\\s.+=\\s*require\\s*\\(',
        ignoreUrls: true,
      },
    ],
    'newline-before-return': 'warn',
    'no-console': ['warn', { allow: ['error'] }],
    semi: ['error', 'never'],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
    'no-trailing-spaces': 'error',
    'object-shorthand': 'error',
    'no-multi-spaces': 'error',
    'no-useless-rename': 'error',
    'eol-last': 'error',
    'arrow-spacing': 'error',
    'dot-notation': 'error',
  },
}]