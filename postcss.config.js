export default {
  plugins: {
    autoprefixer: {},
    'postcss-preset-env': {
      stage: 1,
      features: {
        'custom-properties': false, // Keep CSS custom properties
        'nesting-rules': true,
        'cascade-layers': false,
      },
    },
  },
}
