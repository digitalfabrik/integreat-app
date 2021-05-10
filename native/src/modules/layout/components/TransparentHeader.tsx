import * as React from 'react'
import { Share } from 'react-native'
import styled from 'styled-components/native'
import type { StyledComponent } from 'styled-components'
import 'styled-components'
import type { ThemeType } from '../../theme/constants'
import type { StackHeaderProps } from '@react-navigation/stack'
import { HeaderBackButton } from '@react-navigation/stack'
import { Item } from 'react-navigation-header-buttons'
import type { TFunction } from 'react-i18next'
import dimensions from '../../theme/constants/dimensions'
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
const BoxShadow: StyledComponent<{}, ThemeType, any> = styled.View`
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  height: ${dimensions.modalHeaderHeight}px;
}
`
export type PropsType = StackHeaderProps & {
  theme: ThemeType
  t: TFunction
}

class TransparentHeader extends React.PureComponent<PropsType> {
  goBackInStack = () => {
    this.props.navigation.goBack()
  }
  onShare = async () => {
    const { scene, t } = this.props
    const shareUrl = scene.route.params?.shareUrl

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
        failOnCancel: false
      })
    } catch (e) {
      const errorMessage = e.message ? e.message : t('shareFailDefaultMessage')
      alert(errorMessage)
    }
  }

  render() {
    const { theme, scene, t } = this.props
    const shareUrl = scene.route.params?.shareUrl || null
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
