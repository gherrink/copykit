module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['docs', 'pages', 'scripts', 'stub:base', 'stub:accordion', 'stub:elevate', 'stub:shadow', 'stub:rounded-simple', 'stub:border'],
    ],
  },
}
