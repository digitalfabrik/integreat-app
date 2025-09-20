import { WindowDimensionsType } from '../hooks/useWindowDimensions'

export const mockWindowDimensions: WindowDimensionsType = {
  window: {
    width: 400,
    height: 400,
    scrollX: 0,
    scrollY: 0,
  },
  headerHeight: 90,
  visibleFooterHeight: 64,
  bottomNavigationHeight: undefined,
  ttsPlayerHeight: 100,

  mobile: true,
  desktop: false,
  small: false,
  medium: true,
  large: false,
  xlarge: false,
}
