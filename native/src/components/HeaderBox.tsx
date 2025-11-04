import { HeaderBackButton } from '@react-navigation/elements'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { buildConfigAssets } from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import Icon from './base/Icon'

const HorizontalLeft = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.legacy.colors.backgroundAccentColor};
`

const HeaderText = styled.Text<{ fontSize: number }>`
  flex: 1;
  font-size: ${props => Math.min(props.fontSize, dimensions.headerTextSize)}px;
  color: ${props => props.theme.legacy.colors.textColor};
  font-family: ${props => props.theme.legacy.fonts.native.decorativeFontBold};
`

const StyledIcon = styled(Icon)`
  width: 70px;
  height: 50px;
`

type HeaderBoxProps = {
  goBack?: () => void
  canGoBack?: boolean
  text?: string
  language?: string
}

const HeaderBox = ({ goBack, canGoBack = true, text, language }: HeaderBoxProps): ReactElement => {
  const deviceWidth = useWindowDimensions().width
  const theme = useTheme()
  const { t } = useTranslation('common')

  const AppIcon = buildConfigAssets().AppIcon
  const HeaderIcon = canGoBack ? (
    <HeaderBackButton
      onPress={goBack}
      accessibilityLabel={t('back')}
      displayMode='minimal'
      tintColor={theme.legacy.colors.textColor}
    />
  ) : (
    <StyledIcon Icon={AppIcon} />
  )

  return (
    <HorizontalLeft>
      {HeaderIcon}
      <HeaderText
        allowFontScaling={false}
        fontSize={deviceWidth * dimensions.fontScaling}
        accessibilityLanguage={language}>
        {text}
      </HeaderText>
    </HorizontalLeft>
  )
}

export default HeaderBox
