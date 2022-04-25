export type DimensionsType = {
  maxWidthViewportSmall: number
  smallViewport: string
  mediumViewport: string
  mediumLargeViewport: string
  minMaxWidth: string
  maxWidth: number
  toolbarWidth: number
  toolbarHeight: number
  headerHeightLarge: number
  headerHeightSmall: number
  footerHeight: number
  navigationMenuHeight: number
}

const dimensions: DimensionsType = {
  maxWidthViewportSmall: 768,
  smallViewport: '(max-width: 768px)',
  mediumViewport: '(min-width: 769px) and (max-width: 1100px)',
  mediumLargeViewport: '(min-width: 769px)',
  minMaxWidth: 'screen and (min-width: 1101px)',
  maxWidth: 1100,
  toolbarWidth: 125,
  toolbarHeight: 44,
  headerHeightLarge: 90,
  headerHeightSmall: 70,
  footerHeight: 50,
  navigationMenuHeight: 90
}

export default dimensions
