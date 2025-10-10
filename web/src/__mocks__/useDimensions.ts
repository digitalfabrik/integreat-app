import { Dimensions } from '../hooks/useDimensions'

export const mockDimensions: Dimensions = {
  window: {
    width: 400,
    height: 400,
    scrollX: 0,
    scrollY: 0,
  },
  bottomSheet: {
    snapPoints: {
      min: 96,
      medium: 200,
      large: 350,
      max: 400,
      all: [96, 200, 350, 400],
    },
  },

  headerHeight: 90,
  visibleFooterHeight: 64,
  bottomNavigationHeight: undefined,
  ttsPlayerHeight: 100,
  toolbarWidth: 120,

  mobile: true,
  desktop: false,
  xsmall: true,
  small: false,
  medium: false,
  large: false,
  xlarge: false,
}

export default (): Dimensions => mockDimensions
