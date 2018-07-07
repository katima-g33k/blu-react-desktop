module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
  },
  extends: ['airbnb'],
  plugins: ['react'],
  rules: {
    'max-len': ['warn', { code: 120 }],
    'react/prefer-stateless-function': 0,
    'react/jsx-filename-extension': 0,
    'no-plusplus': 0,
    'no-underscore-dangle': [
      'error',
      { 'allowAfterThis': true },
    ],
    'jsx-a11y/alt-text': 0,
    'jsx-a11y/interactive-supports-focus': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/media-has-caption': 0,
    'jsx-a11y/no-interactive-element-to-noninteractive-role': 0,
    'jsx-a11y/no-noninteractive-element-to-interactive-role': 0,
    'jsx-a11y/no-noninteractive-tabindex': 0,
    'no-prototype-builtins': 0,
  },
}
