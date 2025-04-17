export const contrastThemeMediaQueries = [
  '(forced-colors: active)' /* to detect enabled forced colors mode: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors */,
  '(prefers-contrast: more)' /* to detect a lower/higher contrast: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast */,
  '(prefers-color-scheme: dark)' /* is used to detect if a user has requested light or dark color themes: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme */,
].map(query => window.matchMedia(query))
