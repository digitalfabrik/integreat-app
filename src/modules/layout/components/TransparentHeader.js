// @flow

import * as React from 'react'
import Share from 'react-native-share'
import styled from 'styled-components/native'
import type { NavigationScreenProp } from 'react-navigation'
import type { ThemeType } from 'modules/theme/constants/theme'
import HeaderBackButton from 'react-navigation-stack/lib/module/views/Header/HeaderBackButton'
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons'
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

const BoxShadow = styled.View`
  background-color: transparent;
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  height: ${props => props.theme.dimensions.modalHeaderHeight};
`

type PropsType = {
  navigation: NavigationScreenProp<*>,
  theme: ThemeType,
  t: TFunction
}

const MaterialHeaderButton = props => (
  <HeaderButton {...props} IconComponent={MaterialIcon} iconSize={23} color='black' />
)

const MaterialHeaderButtons = props => {
  return (
    <HeaderButtons
      HeaderButtonComponent={MaterialHeaderButton}
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
    const { navigation } = this.props
    const { url } = navigation.state.params
    // const configOptions = { fileCache: true, path: url }
    // RNFetchBlob.config(configOptions)
    //   .then(resp => {
    //     return resp.readFile('base64')
    //   })
    //   .then(async base64Data => {
    //     // base64Data = `data:${type};base64,` + base64Data;
    //     // await Share.open({ url: base64Data });
    //     console.log("TCL: TransparentHeader -> onShare -> base64Data", base64Data)
    //     // remove the image or pdf from device's storage
    //     // await RNFS.unlink(filePath);
    //   })
    try {
      await Share.open({
        type: 'image/jpg',
        url
      })
    } catch (e) {
      alert(e.message)
    }
  }

  render () {
    const { t } = this.props

    return (
      <BoxShadow theme={this.props.theme}>
        <Horizontal>
          <HorizontalLeft>
            <HeaderBackButton onPress={this.goBack} />
          </HorizontalLeft>
          <MaterialHeaderButtons>
            <Item title={t('share')} show='never' onPress={this.onShare} />
          </MaterialHeaderButtons>
        </Horizontal>
      </BoxShadow>
    )
  }
}

export default TransparentHeader
