// @flow

export type DimensionsType = {|
  smallViewport: string,
  minMaxWidth: string,
  maxWidth: number,
  toolbarWidth: number,
  headerHeightLarge: number,
  headerHeightSmall: number
|}

const dimensions = {
  smallViewport: '(max-width: 750px)',
  minMaxWidth: 'screen and (min-width: 1100px)',
  maxWidth: 1100,
  toolbarWidth: 125,
  headerHeightLarge: 85,
  headerHeightSmall: 55
}

export default dimensions
