// @flow

import * as React from 'react'
import styled from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants/theme'
import { LanguageModel } from '@integreat-app/integreat-api-client'
import Selector from '../../../modules/common/components/Selector'
import SelectorItemModel from '../../../modules/common/models/SelectorItemModel'
import { InteractionManager } from 'react-native'
import type { SwitchContentLanguageActionType } from '../../../modules/app/StoreActionType'

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
  city: string | null,
  currentLanguage: string | null,
  languages: Array<LanguageModel> | null,
  availableLanguages: Array<string>,
  changeLanguage: (city: string, language: string) => SwitchContentLanguageActionType,
  closeModal: () => void
}

class ChangeLanguageModal extends React.Component<PropsType> {
  onPress = (model: LanguageModel) => {
    const {closeModal, changeLanguage, city} = this.props

    if (!city) {
      throw new Error('Value is unexpectedly null') // fixme: This should be handled properly if this is even possible
    }

    closeModal()
    InteractionManager.runAfterInteractions(() => {
      changeLanguage(city, model.code)
    })
  }

  render () {
    const {theme, languages, availableLanguages, city, currentLanguage} = this.props

    if (!languages || !currentLanguage || !city) {
      throw new Error('Value is unexpectedly null') // fixme: This should be handled properly if this is even possible
    }

    return <Wrapper theme={theme}>
      <Selector theme={theme} verticalLayout items={languages.map(languageModel => {
        const isLanguageAvailable = availableLanguages.includes(languageModel.code)
        return new SelectorItemModel({
          code: languageModel.code,
          name: languageModel.name,
          enabled: isLanguageAvailable,
          onPress: () => this.onPress(languageModel)
        })
      })}
                selectedItemCode={currentLanguage} />
    </Wrapper>
  }
}

export default ChangeLanguageModal
