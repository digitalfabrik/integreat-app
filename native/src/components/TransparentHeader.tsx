import { HeaderBackButton } from '@react-navigation/elements'
import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Share } from 'react-native'
import { HiddenItem } from 'react-navigation-header-buttons'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { NavigationPropType, RoutePropType, RoutesType } from '../constants/NavigationTypes'
import dimensions from '../constants/dimensions'
import { reportError } from '../utils/sentry'
import MaterialHeaderButtons from './MaterialHeaderButtons'

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
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  height: ${dimensions.modalHeaderHeight}px;
}
`

type PropsType = {
  route: RoutePropType<RoutesType>
  navigation: NavigationPropType<RoutesType>
}

const TransparentHeader = ({ navigation, route }: PropsType): ReactElement => {
  const { t } = useTranslation('layout')
  const theme = useTheme()

  const shareUrl = route.params?.shareUrl

  const onShare = useCallback(async (): Promise<void> => {
    if (!shareUrl) {
      // The share option should only be shown if there is a shareUrl
      return
    }

    const message = t('shareMessage', {
      message: shareUrl,
      interpolation: {
        escapeValue: false
      }
    })

    try {
      await Share.share({
        message
      })
    } catch (e) {
      // TODO Show snackbar
      reportError(e)
    }
  }, [shareUrl, t])

  return (
    <BoxShadow theme={theme}>
      <Horizontal>
        <HorizontalLeft>
          <HeaderBackButton onPress={navigation.goBack} labelVisible={false} />
        </HorizontalLeft>
        <MaterialHeaderButtons
          cancelLabel={t('cancel')}
          theme={theme}
          items={[]}
          overflowItems={shareUrl ? [<HiddenItem key='share' title={t('share')} onPress={onShare} />] : []}
        />
      </Horizontal>
    </BoxShadow>
  )
}

export default TransparentHeader
