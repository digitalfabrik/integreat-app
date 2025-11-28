import { shouldPolyfill } from '@formatjs/intl-displaynames/should-polyfill'
import '@formatjs/intl-locale/polyfill'
import React, { ReactElement, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Searchbar } from 'react-native-paper'
import styled from 'styled-components/native'

import { ChangeLanguageModalRouteType } from 'shared'
import { LanguageModel } from 'shared/api'
import { config } from 'translations'

import Selector from '../components/Selector'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import { AppContext } from '../contexts/AppContextProvider'
import SelectorItemModel from '../models/SelectorItemModel'
import importDisplayNamesPackage from '../utils/importDisplayNamesPackage'

// https://formatjs.github.io/docs/polyfills/intl-displaynames/#dynamic-import--capability-detection
const loadPolyfillIfNeeded = async (locale: string): Promise<void> => {
  const unsupportedLocale = shouldPolyfill(locale)
  if (unsupportedLocale === undefined) {
    return
  }
  await import('@formatjs/intl-displaynames/polyfill-force')
  await importDisplayNamesPackage(locale)
}

const Wrapper = styled.ScrollView`
  background-color: ${props => props.theme.legacy.colors.backgroundColor};
`

type ChangeLanguageModalProps = {
  route: RouteProps<ChangeLanguageModalRouteType>
  navigation: NavigationProps<ChangeLanguageModalRouteType>
}

const filterLanguageChangePath = (
  languageList: LanguageModel,
  query: string,
  languageNamesInCurrentLanguage: Intl.DisplayNames,
  languageNamesInFallbackLanguage: Intl.DisplayNames,
): boolean => {
  if (query === '') {
    return true
  }
  return (
    languageList.name.toLowerCase().includes(query.toLowerCase()) ||
    !!languageNamesInCurrentLanguage.of(languageList.code)?.toLowerCase().includes(query.toLowerCase()) ||
    !!languageNamesInFallbackLanguage.of(languageList.code)?.toLowerCase().includes(query.toLowerCase())
  )
}

const ChangeLanguageModal = ({ navigation, route }: ChangeLanguageModalProps): ReactElement => {
  const { languages, availableLanguages } = route.params
  const { languageCode, changeLanguageCode } = useContext(AppContext)
  const translationsRef = useRef<InstanceType<typeof Intl.DisplayNames> | undefined>(undefined)
  const [query, setQuery] = useState('')

  useEffect(() => {
    ;(async () => {
      await loadPolyfillIfNeeded(languageCode)
      translationsRef.current = new Intl.DisplayNames([languageCode], { type: 'language' })
    })()
  }, [languageCode])

  const filteredLanguageChangePaths = useMemo(() => {
    const languageNamesInCurrentLanguage = new Intl.DisplayNames([languageCode], { type: 'language' })
    const languageNamesInFallbackLanguage = new Intl.DisplayNames([config.sourceLanguage], { type: 'language' })
    return languages.filter(item =>
      filterLanguageChangePath(item, query, languageNamesInCurrentLanguage, languageNamesInFallbackLanguage),
    )
  }, [languages, query, languageCode])

  const selectorItems = filteredLanguageChangePaths.map(({ code, name }) => {
    const isLanguageAvailable = availableLanguages.includes(code)
    return new SelectorItemModel({
      code,
      name,
      enabled: isLanguageAvailable,
      onPress: () => {
        if (code !== languageCode) {
          changeLanguageCode(code)
        }
        navigation.goBack()
      },
    })
  })

  return (
    <Wrapper contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}>
      <Searchbar placeholder='Search' onChangeText={setQuery} value={query} mode='bar' />
      <Selector selectedItemCode={languageCode} items={selectorItems} />
    </Wrapper>
  )
}

export default ChangeLanguageModal
