import { HeaderBackButton } from '@react-navigation/elements'
import React, { ReactElement } from 'react'
import { useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { buildConfigAssets } from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import Icon from './base/Icon'

const HorizontalLeft = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
`

const HeaderText = styled.Text<{ fontSize: number }>`
  flex: 1;
  font-size: ${props => Math.min(props.fontSize, dimensions.headerTextSize)}px;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
  margin-right: 15px;
`

const StyledIcon = styled(Icon)`
  width: 70px;
  height: 50px;
`

type HeaderBoxProps = {
  goBack?: () => void
  canGoBack?: boolean
  text?: string
}

const HeaderBox = ({ goBack, canGoBack = true, text }: HeaderBoxProps): ReactElement => {
  const deviceWidth = useWindowDimensions().width
  const theme = useTheme()

  const AppIcon = buildConfigAssets().AppIcon
  const HeaderIcon = canGoBack ? (
    <HeaderBackButton onPress={goBack} labelVisible={false} tintColor={theme.colors.textColor} />
  ) : (
    <StyledIcon Icon={AppIcon} />
  )
  return (
    <HorizontalLeft>
      {HeaderIcon}
      <HeaderText allowFontScaling={false} fontSize={deviceWidth * dimensions.fontScaling}>
        {text}
      </HeaderText>
    </HorizontalLeft>
  )
}

export default HeaderBox
