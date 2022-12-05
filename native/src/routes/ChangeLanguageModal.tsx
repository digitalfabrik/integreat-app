import React, { ReactElement, useContext } from 'react'
import styled from 'styled-components/native'

import { ChangeLanguageModalRouteType } from 'api-client'

import Selector from '../components/Selector'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import { AppContext } from '../contexts/AppContextProvider'
import SelectorItemModel from '../models/SelectorItemModel'

const Wrapper = styled.ScrollView`
  background-color: ${props => props.theme.colors.backgroundColor};
`

type ChangeLanguageModalProps = {
  route: RouteProps<ChangeLanguageModalRouteType>
  navigation: NavigationProps<ChangeLanguageModalRouteType>
}

const ChangeLanguageModal = ({ navigation, route }: ChangeLanguageModalProps): ReactElement => {
  const { currentLanguage, languages, availableLanguages } = route.params
  const { changeLanguageCode } = useContext(AppContext)

  const selectorItems = languages.map(({ code, name }) => {
    const isLanguageAvailable = availableLanguages.includes(code)
    return new SelectorItemModel({
      code,
      name,
      enabled: isLanguageAvailable,
      onPress: () => {
        if (code !== currentLanguage) {
          changeLanguageCode(code)
        }
        navigation.goBack()
      },
    })
  })

  return (
    <Wrapper contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <Selector selectedItemCode={currentLanguage} items={selectorItems} />
    </Wrapper>
  )
}

export default ChangeLanguageModal
