import dimensions from '../constants/dimensions'

const min = 0.05
const mid = 0.35
const mapIconsHeight = 60

// Calculates detail snapPoint by reducing height with navigation and iconHeight on the map
const getDetailSnapPoint = (maxHeight: number) =>
  maxHeight - dimensions.headerHeightLarge - dimensions.navigationMenuHeight - mapIconsHeight

export const getSnapPoints = (maxHeight: number): number[] => [
  maxHeight * min,
  maxHeight * mid,
  getDetailSnapPoint(maxHeight),
  maxHeight
]
