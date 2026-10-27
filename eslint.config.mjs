import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ['dist/**', 'node_modules/**', 'eslint.config.mjs'] },
    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'warn',
            'no-console': ['warn', { allow: ['error'] }],
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
            '@typescript-eslint/no-explicit-any': 'error',
        },
    },
    {
        files: ['tests/**/*.ts'],
        rules: {
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
        },
    },
    {
        files: ['*.config.ts'],
        rules: {
            '@typescript-eslint/no-unused-vars': 'error',
        },
    }
);
