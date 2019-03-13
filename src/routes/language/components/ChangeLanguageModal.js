// @flow

import * as React from 'react'
import styled from 'styled-components'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { LanguageModel } from '@integreat-app/integreat-api-client'
import Selector from '../../../modules/common/components/Selector'
import SelectorItemModel from '../../../modules/common/models/SelectorItemModel'
import { InteractionManager } from 'react-native'

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
  city: string,
  languages: Array<LanguageModel>,
  changeLanguage: (city: string, language: string) => void,
  closeModal: () => void
}

class ChangeLanguageModal extends React.Component<PropsType> {
  onPress = (model: LanguageModel) => {
    this.props.closeModal()
    InteractionManager.runAfterInteractions(() => {
      this.props.changeLanguage(this.props.city, model.code)
    })
  }

  render () {
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
