import * as React from 'react'
import { ReactNode } from 'react'
import { InteractionManager } from 'react-native'
import styled from 'styled-components/native'

import { ChangeLanguageModalRouteType, LanguageModel } from 'api-client'
import { ThemeType } from 'build-configs'

import Selector from '../components/Selector'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import SelectorItemModel from '../models/SelectorItemModel'

const Wrapper = styled.ScrollView`
  background-color: ${props => props.theme.colors.backgroundColor};
`
type PropsType = {
  theme: ThemeType
  currentLanguage: string
  languages: Array<LanguageModel>
  availableLanguages: Array<string>
  changeLanguage: (newLanguage: string) => void
  route: RoutePropType<ChangeLanguageModalRouteType>
  navigation: NavigationPropType<ChangeLanguageModalRouteType>
}

class ChangeLanguageModal extends React.Component<PropsType> {
  onPress = (model: LanguageModel): void => {
    const { changeLanguage } = this.props
    this.closeModal()
    InteractionManager.runAfterInteractions(() => {
      changeLanguage(model.code)
    })
  }

  closeModal = (): void => {
    const { navigation } = this.props
    navigation.goBack()
  }

  render(): ReactNode {
    const { theme, languages, availableLanguages, currentLanguage } = this.props
    return (
      <Wrapper
        theme={theme}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center'
        }}>
        <Selector
          theme={theme}
          selectedItemCode={currentLanguage}
          verticalLayout
          items={languages.map(languageModel => {
            const isLanguageAvailable = availableLanguages.includes(languageModel.code)
            return new SelectorItemModel({
              code: languageModel.code,
              name: languageModel.name,
              enabled: isLanguageAvailable,
              onPress: () => this.onPress(languageModel)
            })
          })}
        />
      </Wrapper>
    )
  }
}

export default ChangeLanguageModal
