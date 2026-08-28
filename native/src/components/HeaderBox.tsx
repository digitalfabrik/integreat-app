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
  title?: string
  language?: string
  regionsPath?: () => void
}

const HeaderBox = ({ goBack, canGoBack = true, title, language, regionsPath }: HeaderBoxProps): ReactElement => {
  const theme = useTheme()
  const { t } = useTranslation()

  const AppIcon = buildConfigAssets().AppIcon
  const HeaderIcon = canGoBack ? (
    <Appbar.BackAction
      style={{ backgroundColor: 'transparent' }}
      onPress={goBack}
      accessibilityLabel={t($ => $.common.back)}
      iconColor={theme.colors.onSurface}
    />
  ) : (
    <StyledIcon icon={AppIcon} />
  )

  return (
    <HorizontalLeft>
      {HeaderIcon}
      <HeaderTitle title={title} language={language} regionsPath={regionsPath} />
    </HorizontalLeft>
  )
}

export default HeaderBox
