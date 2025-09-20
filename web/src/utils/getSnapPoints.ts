import { WindowDimensionsType } from '../hooks/useWindowDimensions'

const bottomSheetHandleHeight = 40
const midSnapPercentage = 0.35
const mapIconsHeight = 60

export const getSnapPoints = (dimensions: WindowDimensionsType): [number, number, number, number] => [
  bottomSheetHandleHeight + (dimensions.bottomNavigationHeight ?? 0),
  dimensions.window.height * midSnapPercentage,
  dimensions.window.height - dimensions.headerHeight - mapIconsHeight,
  dimensions.window.height,
]
