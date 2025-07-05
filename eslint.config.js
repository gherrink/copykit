import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'prettier/prettier': 'error',
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
  // Test files configuration
  {
    files: ['**/*.test.{js,ts}', 'test/**/*.{js,ts}'],
    languageOptions: {
      parser: typescriptParser,
      globals: {
        ...globals.browser,
        ...globals.node,
        vi: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'prettier/prettier': 'error',
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
  // CLI scripts configuration
  {
    files: ['scripts/**/*.{js,ts}'],
    languageOptions: {
      parser: typescriptParser,
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'prettier/prettier': 'error',
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
]
