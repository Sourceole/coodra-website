import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist/**',
    'build/**',
    '.react-router/**',
    'AiDesigner/**',
    'hyperframes/**',
    'node_modules/**',
    'tmp-*',
    '*.config.js',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ['src/routes/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['app/**/*.{ts,tsx}', 'src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['src/components/**/*.{ts,tsx}', 'src/dashboard/**/*.{ts,tsx}', 'src/pages/**/*.{ts,tsx}'],
    rules: {
      'react-hooks/immutability': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    files: ['src/**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
])
