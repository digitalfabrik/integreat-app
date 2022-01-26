import * as React from 'react'
import { ReactElement } from 'react'
import { InteractionManager } from 'react-native'
import styled from 'styled-components/native'

import { ChangeLanguageModalRouteType, LanguageModel } from 'api-client'

import Selector from '../components/Selector'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import SelectorItemModel from '../models/SelectorItemModel'

const Wrapper = styled.ScrollView`
  background-color: ${props => props.theme.colors.backgroundColor};
`
type PropsType = {
  currentLanguage: string
  languages: Array<LanguageModel>
  availableLanguages: Array<string>
  changeLanguage: (newLanguage: string) => void
  route: RoutePropType<ChangeLanguageModalRouteType>
  navigation: NavigationPropType<ChangeLanguageModalRouteType>
}

const ChangeLanguageModal = (props: PropsType): ReactElement => {
  const { changeLanguage, navigation, languages, availableLanguages, currentLanguage } = props

  const selectorItems = languages.map(({ code, name }) => {
    const isLanguageAvailable = availableLanguages.includes(code)
    return new SelectorItemModel({
      code,
      name,
      enabled: isLanguageAvailable,
      onPress: () => {
        navigation.goBack()
        InteractionManager.runAfterInteractions(() => {
          changeLanguage(code)
        })
      }
    })
  })

  return (
    <Wrapper contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <Selector selectedItemCode={currentLanguage} verticalLayout items={selectorItems} />
    </Wrapper>
  )
}

export default ChangeLanguageModal
