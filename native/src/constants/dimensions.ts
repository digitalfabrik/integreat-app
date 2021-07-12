export type DimensionsType = {
  headerHeight: number
  modalHeaderHeight: number
  categoryListItem: {
    iconSize: number
    margin: number
  }
  /**
   Multiplikator for font scaling depending on the device width to get variable font size
   */
  fontScaling: number
  headerTextSize: number
}
const dimensions: DimensionsType = {
  headerHeight: 60,
  modalHeaderHeight: 40,
  categoryListItem: {
    iconSize: 40,
    margin: 10
  },
  fontScaling: 0.04,
  headerTextSize: 20
}
export default dimensions
