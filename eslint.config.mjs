// eslint.config.mjs
// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'eslint.config.mjs',
      'ensure-databases.mjs',
      'dist/**',
      'coverage/**',
      'node_modules/**',
      '**/*.spec.ts',
      '**/*.test.ts',
      'test/**',
      'test/config/decorator-ignoring-transformer.js'
    ]
  },

  // 2) Base + TS type-checked + Prettier
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,

  // 3) Language options
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2024,
        ...globals.jest
      },
      sourceType: 'module',
      parserOptions: {
        projectService: {
          allowDefaultProject: ['scripts/generate-postman-collection.js', 'scripts/watch-postman-collection.js']
        },
        tsconfigRootDir: import.meta.dirname
      }
    }
  },

  // 4) Rules
  {
    rules: {
      // Strict TS
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/restrict-template-expressions': 'error',
      '@typescript-eslint/unbound-method': 'error',

      // Ergonomics (low noise, high value)
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/explicit-member-accessibility': ['warn', { accessibility: 'no-public' }],

      // General
      'prefer-spread': 'error',
      'no-unused-expressions': 'off' // use TS version instead
    }
  },

  // 5) Relax tests/scripts/migrations
  {
    files: ['**/*.spec.ts', '**/*.test.ts', 'scripts/**', 'migrations/**'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-floating-promises': 'off'
    }
  }
);
