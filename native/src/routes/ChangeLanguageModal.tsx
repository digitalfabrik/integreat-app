import React, { ReactElement } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components/native'

import { ChangeLanguageModalRouteType } from 'api-client'

import Selector from '../components/Selector'
import { NavigationPropType, RoutePropType } from '../constants/NavigationTypes'
import SelectorItemModel from '../models/SelectorItemModel'

const Wrapper = styled.ScrollView`
  background-color: ${props => props.theme.colors.backgroundColor};
`

type PropsType = {
  route: RoutePropType<ChangeLanguageModalRouteType>
  navigation: NavigationPropType<ChangeLanguageModalRouteType>
}

const ChangeLanguageModal = ({ navigation, route }: PropsType): ReactElement => {
  const { currentLanguage, languages, availableLanguages, cityCode } = route.params
  const dispatch = useDispatch()

  const changeLanguage = (newLanguage: string) => {
    dispatch({
      type: 'SWITCH_CONTENT_LANGUAGE',
      params: {
        newLanguage,
        city: cityCode
      }
    })
  }

  const selectorItems = languages.map(({ code, name }) => {
    const isLanguageAvailable = availableLanguages.includes(code)
    return new SelectorItemModel({
      code,
      name,
      enabled: isLanguageAvailable,
      onPress: () => {
        if (code !== currentLanguage) {
          changeLanguage(code)
        }
        navigation.goBack()
      }
    })
  })

  return (
    <Wrapper contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <Selector selectedItemCode={currentLanguage} items={selectorItems} />
    </Wrapper>
  )
}

export default ChangeLanguageModal
