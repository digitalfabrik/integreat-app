// @flow

import * as React from 'react'
import { type TFunction } from 'react-i18next'
import { Dimensions } from 'react-native'
import Svg, { Circle, Image } from 'react-native-svg'
import { type StyledComponent } from 'styled-components'
import styled from 'styled-components/native'
import { buildConfigAssets } from '../../app/constants/buildConfig'
import type { ThemeType } from '../../theme/constants'

const Container: StyledComponent<{||}, {||}, *> = styled.View`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Text = styled.Text`
  padding-top: 25px;
  font-size: 20px;
  font-weight: 700;
`

const SVG_SIZE_FRACTION = 0.333
const svgSize = Dimensions.get('window').width * SVG_SIZE_FRACTION

const LOGO_SIZE_FRACTION = 0.6
const logoSize = svgSize * LOGO_SIZE_FRACTION
const logoXY = (svgSize - logoSize) / 2

const STROKE_WIDTH_FRACTION = 0.09
const DIAMETER_FRACTION = 1.2
const strokeWidth = svgSize * STROKE_WIDTH_FRACTION
const radius = (svgSize - strokeWidth * DIAMETER_FRACTION) / 2
const circumference = radius * 2 * Math.PI

export type PropsType = {|
  progress: number,
  theme: ThemeType,
  t: TFunction
|}

class ProgressSpinner extends React.Component<PropsType> {
  render() {
    const { t, progress, theme } = this.props
    return (
      <Container>
        <Svg width={svgSize} height={svgSize} testID='loading-image'>
          <Image
            width={logoSize}
            height={logoSize}
            transform={`translate(${logoXY}, ${logoXY})`}
            xlinkHref={buildConfigAssets().loadingImage}
          />
          <Circle
            stroke={theme.colors.themeColor}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress * circumference}
            strokeWidth={svgSize * STROKE_WIDTH_FRACTION}
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
          />
        </Svg>
        <Text>{t('loading')}</Text>
      </Container>
    )
  }
}

export default ProgressSpinner
