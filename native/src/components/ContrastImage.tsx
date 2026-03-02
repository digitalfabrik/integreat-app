import React, { ReactElement } from 'react'
import { brightness, ColorMatrix, concatColorMatrices, invert, saturate } from 'react-native-color-matrix-image-filters'

const BRIGHTNESS_FILTER_VALUE = 7

const ContrastImage = ({ children }: { children: ReactElement }): ReactElement => (
  <ColorMatrix matrix={concatColorMatrices(invert(), saturate(0), brightness(BRIGHTNESS_FILTER_VALUE))}>
    {children}
  </ColorMatrix>
)

export default ContrastImage
