import { HeaderBackButton, StackHeaderProps } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { TFunction } from 'react-i18next'
import { Share } from 'react-native'
import { HiddenItem } from 'react-navigation-header-buttons'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs'

import dimensions from '../constants/dimensions'
import { reportError } from '../utils/sentry'
import MaterialHeaderButtons from './MaterialHeaderButtons'
import useSnackbar from '../hooks/useSnackbar'
import buildConfig from '../constants/buildConfig'


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

export type PropsType = StackHeaderProps & {
  theme: ThemeType
  t: TFunction<'layout'>
}

type RouteParams = { [key: string]: string } | null


const TransparentHeader = (props:PropsType) : ReactElement => {
 const { theme, scene, t, navigation } = props
 const shareUrl = (scene.route.params as RouteParams)?.shareUrl


 const goBackInStack = (): void => {
    navigation.goBack()
  }

  const showSnackbar = useSnackbar()
  const onShare = async (): Promise<void> => {

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
        message,
        title: buildConfig().appName
      })
    } catch (e) {
      showSnackbar(t('generalError'))
      reportError(e)
    }
  }

    return (
      <BoxShadow theme={theme}>
        <Horizontal>
          <HorizontalLeft>
            <HeaderBackButton onPress={goBackInStack} labelVisible={false} />
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
