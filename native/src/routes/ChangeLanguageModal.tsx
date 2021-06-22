import * as React from 'react'
import styled from 'styled-components/native'
import { ThemeType } from 'build-configs'
import Selector from '../components/Selector'
import SelectorItemModel from '../models/SelectorItemModel'
import { InteractionManager } from 'react-native'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import { ChangeLanguageModalRouteType, NewsType, LanguageModel } from 'api-client'
import { ReactNode } from 'react'

const Wrapper = styled.ScrollView`
  background-color: ${props => props.theme.colors.backgroundColor};
`
type PropsType = {
  theme: ThemeType
  currentLanguage: string
  languages: Array<LanguageModel>
  availableLanguages: Array<string>
  changeLanguage: (newLanguage: string, newsType: NewsType | undefined) => void
  route: RoutePropType<ChangeLanguageModalRouteType>
  navigation: NavigationPropType<ChangeLanguageModalRouteType>
  newsType: NewsType | undefined
}

class ChangeLanguageModal extends React.Component<PropsType> {
  onPress = (model: LanguageModel): void => {
    const { changeLanguage, newsType } = this.props
    this.closeModal()
    InteractionManager.runAfterInteractions(() => {
      changeLanguage(model.code, newsType)
    })
  }

  closeModal = (): void => {
    this.props.navigation.goBack()
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
