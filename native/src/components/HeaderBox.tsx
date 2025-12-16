import { HeaderBackButton } from '@react-navigation/elements'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowDimensions } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { buildConfigAssets } from '../constants/buildConfig'
import dimensions from '../constants/dimensions'
import Icon from './base/Icon'
import Text from './base/Text'

const HorizontalLeft = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.surface};
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
      tintColor={theme.colors.onSurface}
    />
  ) : (
    <StyledIcon Icon={AppIcon} />
  )

  return (
    <HorizontalLeft>
      {HeaderIcon}
      <Text
        variant='h6'
        allowFontScaling={false}
        style={{
          flex: 1,
          fontSize: Math.min(deviceWidth * dimensions.fontScaling, dimensions.headerTextSize),
          fontFamily: theme.legacy.fonts.native.decorativeFontBold,
        }}
        accessibilityLanguage={language}>
        {text}
      </Text>
    </HorizontalLeft>
  )
}

export default HeaderBox
