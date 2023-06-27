import { HeaderBackButton } from '@react-navigation/elements'
import React, { ReactElement } from 'react'
import { useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { buildConfigAssets } from '../constants/buildConfig'
import dimensions from '../constants/dimensions'

const IntegreatIcon = styled.Image`
  width: 70px;
  height: 50px;
  resize-mode: contain;
`

const HorizontalLeft = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const HeaderText = styled.Text<{ fontSize: number; centered: boolean }>`
  flex: 1;
  font-size: ${props => Math.min(props.fontSize, dimensions.headerTextSize)}px;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  text-align: ${props => (props.centered ? 'center' : 'auto')};
  padding-right: ${props => (props.centered ? '16px' : '0')};
`

type HeaderBoxProps = {
  goBack?: () => void
  canGoBack?: boolean
  text?: string
  textCentered?: boolean
}

const HeaderBox = ({ goBack, canGoBack = true, text, textCentered = false }: HeaderBoxProps): ReactElement => {
  const deviceWidth = useWindowDimensions().width
  const theme = useTheme()

  const HeaderIcon = canGoBack ? (
    <HeaderBackButton onPress={goBack} labelVisible={false} tintColor={theme.colors.textColor} />
  ) : (
    <IntegreatIcon source={buildConfigAssets().appIcon} />
  )
  return (
    <HorizontalLeft>
      {HeaderIcon}
      <HeaderText allowFontScaling={false} fontSize={deviceWidth * dimensions.fontScaling} centered={textCentered}>
        {text}
      </HeaderText>
    </HorizontalLeft>
  )
}

export default HeaderBox
