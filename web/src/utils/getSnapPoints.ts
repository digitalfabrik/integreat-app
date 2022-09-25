import dimensions from '../constants/dimensions'

const minSnapPercentage = 0.05
export const midSnapPercentage = 0.35
const mapIconsHeight = 60

// Calculates detail snapPoint by reducing height with navigation and iconHeight on the map
const getLargeSnapPoint = (maxHeight: number) =>
  maxHeight - dimensions.headerHeightLarge - dimensions.navigationMenuHeight - mapIconsHeight

export const getSnapPoints = (maxHeight: number): number[] => [
  maxHeight * minSnapPercentage,
  maxHeight * midSnapPercentage,
  getLargeSnapPoint(maxHeight),
  maxHeight,
]
