// @flow

import * as React from 'react'
import styled from 'styled-components/native'
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
  availableLanguages: Array<string>,
  changeLanguage: (city: string, language: string) => void,
  closeModal: () => void
}

class ChangeLanguageModal extends React.Component<PropsType> {
  onPress = (model: LanguageModel) => {
    const { closeModal, changeLanguage, city } = this.props
    closeModal()
    InteractionManager.runAfterInteractions(() => {
      changeLanguage(city, model.code)
    })
  }

  render () {
    const { theme, languages, availableLanguages } = this.props
    return <Wrapper theme={theme}>
      <Selector verticalLayout items={languages.map(languageModel => {
        const isLanguageAvailable = availableLanguages.includes(languageModel.code)
        return new SelectorItemModel({
          code: languageModel.code,
          name: languageModel.name,
          active: isLanguageAvailable,
          onPress: () => isLanguageAvailable ? this.onPress(languageModel) : undefined
        })
      })} />
    </Wrapper>
  }
}

export default ChangeLanguageModal
