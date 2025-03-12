import { TSESLint } from '@typescript-eslint/utils'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import oxlint from 'eslint-plugin-oxlint'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'


// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

const eslintConfigs: TSESLint.FlatConfig.Config[] = defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/src/*.{ts,mts,tsx,vue}']
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/.vscode/**']
  },
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  ...oxlint.configs['flat/recommended'],
  skipFormatting,
  {
    name: 'app/rules',
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
          ...globals.browser,
          uni: true
        }
      }
    },
    rules: {
      'vue/multi-word-component-names': 0,
      'vue/first-attribute-linebreak': 0,
      'vue/require-default-prop': 0,
      '@typescript-eslint/ban-ts-comment': 0,
      '@typescript-eslint/no-explicit-any': 1
    }
  }
)

export default eslintConfigs
