// @flow

export type DimensionsType = {|
  web: {|
    smallViewport: string,
    minMaxWidth: string,
    maxWidth: number,
    toolbarWidth: number,
    headerHeightLarge: number,
    headerHeightSmall: number
  |},
  native: {|
    headerHeight: number,
    modalHeaderHeight: number,
    categoryListItem: {|
      iconSize: number,
      margin: number
    |}
  |}
|}

const dimensions: DimensionsType = {
  web: {
    smallViewport: '(max-width: 750px)',
    minMaxWidth: 'screen and (min-width: 1100px)',
    maxWidth: 1100,
    toolbarWidth: 125,
    headerHeightLarge: 90,
    headerHeightSmall: 70
  },
  native: {
    headerHeight: 60,
    modalHeaderHeight: 40,
    categoryListItem: {
      iconSize: 40,
      margin: 10
    }
  }
}

export default dimensions
