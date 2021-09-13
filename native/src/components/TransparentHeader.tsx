import { HeaderBackButton, StackHeaderProps } from '@react-navigation/stack'
import * as React from 'react'
import { ReactNode } from 'react'
import { TFunction } from 'react-i18next'
import { Share } from 'react-native'
import { Item } from 'react-navigation-header-buttons'
import styled from 'styled-components/native'

import { ThemeType } from 'build-configs'

import dimensions from '../constants/dimensions'
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

export type PropsType = StackHeaderProps & {
  theme: ThemeType
  t: TFunction<'layout'>
}

type RouteParams = { [key: string]: string } | null

class TransparentHeader extends React.PureComponent<PropsType> {
  goBackInStack = (): void => {
    this.props.navigation.goBack()
  }

  onShare = async (): Promise<void> => {
    const { scene, t } = this.props
    const shareUrl = (scene.route.params as RouteParams)?.shareUrl

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
      const errorMessage = e.message ? e.message : t('shareFailDefaultMessage')
      // TODO Show snackbar
      console.error(errorMessage)
    }
  }

  render(): ReactNode {
    const { theme, scene, t } = this.props
    const shareUrl = (scene.route.params as RouteParams)?.shareUrl
    return (
      <BoxShadow theme={theme}>
        <Horizontal>
          <HorizontalLeft>
            <HeaderBackButton onPress={this.goBackInStack} labelVisible={false} />
          </HorizontalLeft>
          <MaterialHeaderButtons cancelLabel={t('cancel')} theme={theme}>
            {shareUrl && <Item title={t('share')} show='never' onPress={this.onShare} />}
          </MaterialHeaderButtons>
        </Horizontal>
      </BoxShadow>
    )
  }
}

export default TransparentHeader
