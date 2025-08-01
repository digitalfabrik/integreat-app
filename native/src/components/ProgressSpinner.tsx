import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions } from 'react-native'
import Svg, { Circle, G } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { buildConfigAssets } from '../constants/buildConfig'

const Container = styled.View`
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
  color: ${props => props.theme.colors.textColor};
`

const LoadingImage = styled(buildConfigAssets().LoadingImage)`
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`

const SVG_SIZE_FRACTION = 0.333
const svgSize = Dimensions.get('window').width * SVG_SIZE_FRACTION
const LOGO_SIZE_FRACTION = 0.8
const logoSize = svgSize * LOGO_SIZE_FRACTION
const logoXY = (svgSize - logoSize) / 2
const STROKE_WIDTH_FRACTION = 0.09
const DIAMETER_FRACTION = 1.2
const strokeWidth = svgSize * STROKE_WIDTH_FRACTION
const radius = (svgSize - strokeWidth * DIAMETER_FRACTION) / 2
const circumference = radius * 2 * Math.PI

export type ProgressSpinnerProps = {
  progress: number
}

const ProgressSpinner = ({ progress }: ProgressSpinnerProps): ReactElement => {
  const { t } = useTranslation('common')
  const theme = useTheme()
  return (
    <Container>
      <Svg width={svgSize} height={svgSize} testID='loading-image'>
        <G transform={`translate(${logoXY}, ${logoXY})`}>
          <LoadingImage width={logoSize} height={logoSize} />
        </G>
        <Circle
          fill='none'
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

export default ProgressSpinner
