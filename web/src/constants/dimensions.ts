export type DimensionsType = {
  smallViewport: string
  mediumViewport: string
  minMaxWidth: string
  maxWidth: number
  toolbarWidth: number
  headerHeightLarge: number
  headerHeightSmall: number
  smallViewportBorderValue : number
  mediumViewportBorderValue : number
}

const smallViewportBorderValue = 750
const mediumViewportBorderValue = 1100
const dimensions: DimensionsType = {
  smallViewportBorderValue,
  mediumViewportBorderValue,
  smallViewport: `(max-width: ${smallViewportBorderValue}px)`,
  mediumViewport: `(min-width: ${smallViewportBorderValue}px) and (max-width: ${mediumViewportBorderValue}px)`,
  minMaxWidth: `screen and (min-width: ${mediumViewportBorderValue}px)`,
  maxWidth: mediumViewportBorderValue,
  toolbarWidth: 125,
  headerHeightLarge: 90,
  headerHeightSmall: 70
}

export default dimensions
