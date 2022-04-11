export type DimensionsType = {
  maxWidthViewportSmall: number
  smallViewport: string
  mediumViewport: string
  minMaxWidth: string
  maxWidth: number
  toolbarWidth: number
  toolbarHeight: number
  headerHeightLarge: number
  headerHeightSmall: number
  footerHeight: number
  navigationMenuHeight: number
  languageSelectionHeight: number
}

const dimensions: DimensionsType = {
  maxWidthViewportSmall: 768,
  smallViewport: '(max-width: 768px)',
  mediumViewport: '(min-width: 768px) and (max-width: 1100px)',
  minMaxWidth: 'screen and (min-width: 1100px)',
  maxWidth: 1100,
  toolbarWidth: 125,
  toolbarHeight: 73,
  headerHeightLarge: 90,
  headerHeightSmall: 70,
  footerHeight: 50,
  navigationMenuHeight: 90,
  languageSelectionHeight: 180
}

export default dimensions
