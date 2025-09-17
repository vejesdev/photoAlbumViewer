
import eslintJs from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

export default [
    {
        ignores: [
            '**/dist/',
            '**/vendor/',
            ''
        ],
    },
    eslintJs.configs['recommended'],
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        rules: {},
    },
    ...pluginVue.configs['flat/strongly-recommended'],
    {
        files: ['**/*.vue'],
        rules: {
          'semi': ['error', 'always'],
          'vue/order-in-components': ['error', {}],
          'vue/attributes-order': ['warn', {
            'order': [
              'DEFINITION',
              'LIST_RENDERING',
              'CONDITIONALS',
              'RENDER_MODIFIERS',
              'GLOBAL',
              ['UNIQUE', 'SLOT'],
              'TWO_WAY_BINDING',
              'OTHER_DIRECTIVES',
              'OTHER_ATTR',
              'EVENTS',
              'CONTENT'
            ],
            'alphabetical': false,
          }]
        }
    },
]