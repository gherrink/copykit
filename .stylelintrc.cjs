/** @type {import('stylelint').Config} */
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-clean-order',
    'stylelint-prettier/recommended',
  ],
  plugins: ['stylelint-prettier'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['layer', 'apply', 'responsive', 'screen'],
      },
    ],
    'declaration-empty-line-before': null,
    'custom-property-empty-line-before': null,
    'comment-empty-line-before': null,
    'selector-class-pattern': null,
    'value-keyword-case': ['lower', { ignoreKeywords: ['dummyValue'] }],
  },
  ignoreFiles: ['dist/**/*', 'node_modules/**/*'],
}
