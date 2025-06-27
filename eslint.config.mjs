import { builtinModules } from 'module';
import js from '@eslint/js';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import globals from 'globals';

export default [
  js.configs.recommended,
  reactRecommended,
  {
    ignores: ["node_modules/**"],
  },
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser, // Añade todos los globals del navegador
        ...globals.node, // Añade globals de Node.js
        ...builtinModules.reduce((acc, mod) => {
          acc[mod] = "readonly";
          return acc;
        }, {}),
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      "no-undef": "error",
      "quotes": ["warn", "double"],
      "semi": ["error", "always"],
      "no-var": "warn",
      "func-names": "error",
      "no-trailing-spaces": "warn",
      "space-before-blocks": ["error", "always"],
      "quote-props": ["error", "consistent"],
      "no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      "indent": ["error", 2],
      "no-eval": "error",
      "no-multiple-empty-lines": ["error", { "max": 1 }],
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off", 
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error"
  }
  },
  {
    settings: {
      react: {
        version: "detect"
      }
    }
  }
];