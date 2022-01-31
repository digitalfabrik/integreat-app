import { HeaderBackButton } from '@react-navigation/elements'
import { StackHeaderProps } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import dimensions from '../constants/dimensions'

const Horizontal = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const HorizontalLeft = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`
const BoxShadow = styled.View`
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.18;
  shadow-radius: 1px;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  height: ${dimensions.headerHeight}px;
`
const HeaderText = styled.Text`
  flex: 1;
  flex-direction: column;
  text-align-vertical: center;
  height: 50px;
  /* fix text-align-vertical for ios, line-height has to be added */
  line-height: 50px;
  font-size: 20px;
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.decorativeFontBold};
`

const SettingsHeader = ({ navigation }: StackHeaderProps): ReactElement => {
  const { t } = useTranslation('layout')
  const theme = useTheme()

  return (
    <BoxShadow theme={theme}>
      <Horizontal>
        <HorizontalLeft>
          <HeaderBackButton onPress={navigation.goBack} labelVisible={false} />
          <HeaderText theme={theme}>{t('settings')}</HeaderText>
        </HorizontalLeft>
      </Horizontal>
    </BoxShadow>
  )
}

export default SettingsHeader
