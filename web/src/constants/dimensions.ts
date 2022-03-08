export type DimensionsType = {
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
}

const dimensions: DimensionsType = {
  smallViewport: '(max-width: 750px)',
  mediumViewport: '(min-width: 750px) and (max-width: 1100px)',
  minMaxWidth: 'screen and (min-width: 1100px)',
  maxWidth: 1100,
  toolbarWidth: 125,
  toolbarHeight: 73,
  headerHeightLarge: 90,
  headerHeightSmall: 70,
  footerHeight: 50,
  navigationMenuHeight: 90
}

export default dimensions
