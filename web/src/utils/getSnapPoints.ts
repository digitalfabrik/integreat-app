import { WindowDimensionsType } from '../hooks/useWindowDimensions'

const minSnapPercentage = 0.05
const midSnapPercentage = 0.35
const mapIconsHeight = 60

export const getSnapPoints = (dimensions: WindowDimensionsType): [number, number, number, number] => [
  dimensions.height * minSnapPercentage,
  dimensions.height * midSnapPercentage,
  dimensions.height - dimensions.headerHeight - mapIconsHeight,
  dimensions.height,
]
