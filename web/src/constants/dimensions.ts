export type DimensionsType = {
  maxWidthViewportSmall: number
  smallViewport: string
  mediumViewport: string
  mediumLargeViewport: string
  minMaxWidth: string
  maxWidth: number
  toolbarWidth: number
  toolbarHeight: number
  ttsPlayerHeight: number
  maxTtsPlayerWidth: number
  poiDetailNavigation: number
  headerHeightLarge: number
  headerHeightSmall: number
  navigationMenuHeight: number
  poiDesktopPanelWidth: number
  mainContainerHorizontalPadding: number
}

const dimensions: DimensionsType = {
  maxWidthViewportSmall: 768,
  smallViewport: '(width <= 768px)',
  mediumViewport: '(width > 768px) and (width <= 1100px)',
  mediumLargeViewport: '(width > 768px)',
  minMaxWidth: '(width > 1100px)',
  maxWidth: 1100,
  toolbarWidth: 200,
  poiDetailNavigation: 42,
  toolbarHeight: 66,
  ttsPlayerHeight: 90,
  maxTtsPlayerWidth: 576,
  headerHeightLarge: 90,
  headerHeightSmall: 70,
  navigationMenuHeight: 90,
  poiDesktopPanelWidth: 332,
  mainContainerHorizontalPadding: 10,
}

export default dimensions
