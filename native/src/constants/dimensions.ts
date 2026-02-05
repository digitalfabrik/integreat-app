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
  bottomSheetHandle: {
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
    iconSize: 40,
    margin: 5,
  },
  fontScaling: 0.04,
  headerTextSize: 20,
  bottomSheetHandle: {
    height: 40,
  },
  locationFab: {
    margin: 8,
  },
  pageContainerPaddingHorizontal: 16,
}
export default dimensions
