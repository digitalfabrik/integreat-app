export type DimensionsType = {
  headerHeight: number
  modalHeaderHeight: number
  ttsPlayerHeight: number
  categoryListItem: {
    iconSize: number
    margin: number
  }
  /**
   Multiplikator for font scaling depending on the device width to get variable font size
   */
  fontScaling: number
  headerTextSize: number
  bottomSheetHandler: {
    height: number
  }
  locationFab: {
    margin: number
  }
  pageContainerPaddingHorizontal: number
}
const dimensions: DimensionsType = {
  headerHeight: 60,
  modalHeaderHeight: 40,
  ttsPlayerHeight: 100,
  categoryListItem: {
    iconSize: 20,
    margin: 5,
  },
  fontScaling: 0.04,
  headerTextSize: 20,
  bottomSheetHandler: {
    height: 40,
  },
  locationFab: {
    margin: 8,
  },
  pageContainerPaddingHorizontal: 16,
}
export default dimensions
