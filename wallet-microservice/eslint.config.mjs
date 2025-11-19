import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    env: {
      node: true,
      es2021: true,
    },
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended', 'eslint:recommended'],
    languageOptions: { globals: globals.node },
    overrides: [
      {
        files: ['**/__tests__/**/*.js', '**/*.test.js'],
        env: {
          jest: true,
        },
      },
    ],
  },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
])
