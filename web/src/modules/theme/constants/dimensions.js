// @flow

export type DimensionsType = {|
  smallViewport: string,
  mediumViewport: string,
  minMaxWidth: string,
  maxWidth: number,
  toolbarWidth: number,
  headerHeightLarge: number,
  headerHeightSmall: number
|}

const dimensions: DimensionsType = {
  smallViewport: '(max-width: 750px)',
  mediumViewport: '(min-width: 750px) and (max-width: 1100px)',
  minMaxWidth: 'screen and (min-width: 1100px)',
  maxWidth: 1100,
  toolbarWidth: 125,
  headerHeightLarge: 90,
  headerHeightSmall: 70
}

export default dimensions
