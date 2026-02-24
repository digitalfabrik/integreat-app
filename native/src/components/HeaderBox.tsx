import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Appbar } from 'react-native-paper'
import styled, { useTheme } from 'styled-components/native'

import { buildConfigAssets } from '../constants/buildConfig'
import HeaderTitle from './HeaderTitle'
import Icon from './base/Icon'

const HorizontalLeft = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
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
  landingPath?: () => void
}

const HeaderBox = ({ goBack, canGoBack = true, text, language, landingPath }: HeaderBoxProps): ReactElement => {
  const theme = useTheme()
  const { t } = useTranslation('common')

  const AppIcon = buildConfigAssets().AppIcon
  const HeaderIcon = canGoBack ? (
    <Appbar.BackAction
      style={{ backgroundColor: 'transparent' }}
      onPress={goBack}
      accessibilityLabel={t('back')}
      iconColor={theme.colors.onSurface}
    />
  ) : (
    <StyledIcon Icon={AppIcon} />
  )

  return (
    <HorizontalLeft>
      {HeaderIcon}
      <HeaderTitle title={text} language={language} landingPath={landingPath} />
    </HorizontalLeft>
  )
}

export default HeaderBox
