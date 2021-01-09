// @flow

import * as React from 'react'
import Svg, { Circle, Image } from 'react-native-svg'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import { buildConfigAssets } from '../../app/constants/buildConfig'
import type { ThemeType } from '../../theme/constants'
import { type TFunction } from 'react-i18next'

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

const { width } = Dimensions.get('window')
const size = width / 3 // eslint-disable-line no-magic-numbers

const logoSize = size * 0.6 // eslint-disable-line no-magic-numbers
const logoXY = (size - logoSize) / 2
const logoToCenter = `translate(${logoXY}, ${logoXY})`

// progress
const strokeWidth = size * 0.09 // eslint-disable-line no-magic-numbers
const r = (size - strokeWidth) / 2
const cx = size / 2
const cy = size / 2
const circumference = r * 2 * Math.PI
const strokeDasharray = circumference

type PropsType = {|
  progress: number,
  theme: ThemeType,
  t: TFunction
|}

class ProgressBar extends React.Component<PropsType> {
  render () {
    const { t, progress, theme } = this.props
    const strokeDashoffset = circumference - progress * circumference
    return (
      <Container>
        <Svg width={size} height={size}>
            <Image width={logoSize} height={logoSize} transform={logoToCenter}
              xlinkHref={buildConfigAssets().loadingImage} />
            <Circle stroke= {theme.colors.themeColor}
              {...{ strokeDasharray, strokeDashoffset, strokeWidth, cx, cy, r }}
            />
        </Svg>
        <Text>{t('loading')}</Text>
      </Container>
    )
  }
}

export default ProgressBar
