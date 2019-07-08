
// @flow

import * as React from 'react'
import styled, { type StyledComponent } from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { LanguageModel } from '@integreat-app/integreat-api-client'
import Selector from '../../../modules/common/components/Selector'
import SelectorItemModel from '../../../modules/common/models/SelectorItemModel'
import { InteractionManager } from 'react-native'
import type { NavigationScreenProp } from 'react-navigation'

const Wrapper: StyledComponent<{}, ThemeType, *> = styled.View`
  position: absolute;  
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.backgroundColor};
`

type PropsType = {
  theme: ThemeType,
  city?: string,
  currentLanguage?: string,
  languages?: Array<LanguageModel>,
  availableLanguages?: Array<string>,
  changeLanguage: (city: string, newLanguage: string) => void,
  closeModal: () => void,
  navigation: NavigationScreenProp<*>
}

class ChangeLanguageModal extends React.Component<PropsType> {
  onPress = (model: LanguageModel, city: string) => {
    const { closeModal, changeLanguage } = this.props

    closeModal()
    InteractionManager.runAfterInteractions(() => {
      changeLanguage(city, model.code)
    })
  }

  render () {
    const {theme, languages, availableLanguages, currentLanguage, city} = this.props
    if (!languages || !availableLanguages || !currentLanguage || !city) {
      return null
    }

    return <Wrapper theme={theme}>
      <Selector theme={theme} selectedItemCode={currentLanguage} verticalLayout items={languages.map(languageModel => {
        const isLanguageAvailable = availableLanguages.includes(languageModel.code)
        return new SelectorItemModel({
          code: languageModel.code,
          name: languageModel.name,
          enabled: isLanguageAvailable,
          onPress: () => this.onPress(languageModel, city)
        })
      })} />
    </Wrapper>
  }
}

export default ChangeLanguageModal
