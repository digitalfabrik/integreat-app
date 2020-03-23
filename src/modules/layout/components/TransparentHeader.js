// @flow

import * as React from 'react'
import Share from 'react-native-share'
import styled from 'styled-components/native'
import { type StyledComponent } from 'styled-components'
import type { NavigationScreenProp } from 'react-navigation'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import HeaderBackButton from 'react-navigation-stack/lib/module/views/Header/HeaderBackButton'
import { HeaderButtons, HeaderButton, Item } from 'react-navigation-header-buttons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import type { TFunction } from 'react-i18next'

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
  height: ${props => props.theme.dimensions.modalHeaderHeight}px;
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
  navigation: NavigationScreenProp<*>,
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
  goBack = () => {
    this.props.navigation.goBack(null)
  }

  onShare = async () => {
    const { navigation, t } = this.props
    const url: ?string = navigation.state.params.url

    if (url) {
      try {
        await Share.open({
          url,
          failOnCancel: false
        })
      } catch (e) {
        const errorMessage = e.message ? e.message : t('shareFailDefaultMessage')
        alert(errorMessage)
      }
    }
  }

  render () {
    const { theme, float, navigation, t } = this.props
    const shareUrl = navigation.state.params.url

    return (
      <BoxShadow theme={theme} float={float}>
        <Horizontal>
          <HorizontalLeft>
            <HeaderBackButton onPress={this.goBack} />
          </HorizontalLeft>
          {shareUrl && <MaterialHeaderButtons>
            <Item title={t('share')} show='never' onPress={this.onShare} />
          </MaterialHeaderButtons>}
        </Horizontal>
      </BoxShadow>
    )
  }
}

export default TransparentHeader
