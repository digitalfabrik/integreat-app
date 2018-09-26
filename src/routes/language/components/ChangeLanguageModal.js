// @flow

import * as React from 'react'
import styled from 'styled-components'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { NavigationActions, StackActions } from 'react-navigation'
import CityModel from '../../../modules/endpoint/models/CityModel'
import LanguageModel from '../../../modules/endpoint/models/LanguageModel'
import { Text } from 'react-native'
import Selector from '../../../modules/common/components/Selector'
import SelectorItemModel from '../../../modules/common/models/SelectorItemModel'

const Wrapper = styled.View`
  position: absolute;  
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.backgroundColor};
`

type PropsType = {
  theme: ThemeType,
  languages: Array<LanguageModel>,
  changeLanguage: (language: string) => void
}

class ChangeLanguageModal extends React.Component<PropsType> {
  onPress = (model: LanguageModel) => {
    this.props.changeLanguage(model.code)
  }

  render () {
    console.log()
    return <Wrapper theme={this.props.theme}>
      <Selector verticalLayout items={this.props.languages.map(languageModel => new SelectorItemModel({
        code: languageModel.code,
        name: languageModel.name,
        onPress: () => this.onPress(languageModel)
      }))} />
    </Wrapper>
  }
}

export default ChangeLanguageModal
