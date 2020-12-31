// @flow

import * as React from 'react'
import { Share } from 'react-native'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { ThemeType } from '../../theme/constants'
import { HeaderBackButton, type StackHeaderProps } from '@react-navigation/stack'
import { HeaderButtons, HeaderButton, Item } from 'react-navigation-header-buttons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import type { TFunction } from 'react-i18next'
import dimensions from '../../theme/constants/dimensions'

const Horizontal = styled.View`
  flex:1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const HorizontalLeft = styled.View`
  flex:1;
  flex-direction: row;
  align-items: center;
`

const BoxShadow: StyledComponent<{float: boolean}, ThemeType, *> = styled.View`
  background-color: ${props => props.float ? 'transparent' : props.theme.colors.backgroundColor};
  height: ${dimensions.modalHeaderHeight}px;
  ${props => props.float
    ? `position: absolute;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;`
    : ''
}
`

type PropsType = {|
  ...StackHeaderProps,
  theme: ThemeType,
  float: boolean,
  t: TFunction
|}

const MaterialHeaderButton = props => (
  <HeaderButton {...props} IconComponent={MaterialIcon} iconSize={23} color='black' />
)

const MaterialHeaderButtons = props => {
  return (
    // $FlowFixMe onOverflowMenuPress should not be required
    <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}
                   OverflowIcon={<MaterialIcon name='more-vert' size={23} color='black' />}
                   {...props}
    />
  )
}

class TransparentHeader extends React.PureComponent<PropsType> {
  goBackInStack = () => {
    this.props.navigation.goBack()
  }

  onShare = async () => {
    const { scene, t } = this.props
    const shareUrl = scene.route.params?.shareUrl || ''
    if (shareUrl) {
      const message = t('shareMessage', {
        message: shareUrl,
        interpolation: { escapeValue: false }
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
  }

  render () {
    const { theme, float, scene, t } = this.props
    const shareUrl = scene.route.params?.shareUrl || ''

    return (
      <BoxShadow theme={theme} float={float}>
        <Horizontal>
          <HorizontalLeft>
            <HeaderBackButton onPress={this.goBackInStack} labelVisible={false} />
          </HorizontalLeft>
          {shareUrl
            ? <MaterialHeaderButtons cancelLabel={t('cancel')} theme={theme}>
              <Item title={t('share')} show='never' onPress={this.onShare} />
            </MaterialHeaderButtons>
            : null}
        </Horizontal>
      </BoxShadow>
    )
  }
}

export default TransparentHeader
