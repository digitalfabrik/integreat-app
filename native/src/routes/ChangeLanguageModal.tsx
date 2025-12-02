import { shouldPolyfill } from '@formatjs/intl-displaynames/should-polyfill'
import '@formatjs/intl-locale/polyfill'
import React, { ReactElement, useContext, useEffect, useMemo, useState } from 'react'
import { Searchbar, useTheme } from 'react-native-paper'
import styled from 'styled-components/native'

import { ChangeLanguageModalRouteType, normalizeString } from 'shared'
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
  await importDisplayNamesPackage(config.sourceLanguage)
}

const filterLanguages = (
  languageList: LanguageModel,
  query: string,
  languageNamesInCurrentLanguage: Intl.DisplayNames,
  languageNamesInFallbackLanguage: Intl.DisplayNames,
): boolean => {
  const normalizedQuery = normalizeString(query)
  return (
    normalizeString(languageList.name).includes(normalizedQuery) ||
    normalizeString(languageNamesInCurrentLanguage.of(languageList.code) || '').includes(normalizedQuery) ||
    normalizeString(languageNamesInFallbackLanguage.of(languageList.code) || '').includes(normalizedQuery)
  )
}

const Wrapper = styled.ScrollView`
  background-color: ${props => props.theme.legacy.colors.backgroundColor};
`

type ChangeLanguageModalProps = {
  route: RouteProps<ChangeLanguageModalRouteType>
  navigation: NavigationProps<ChangeLanguageModalRouteType>
}

const ChangeLanguageModal = ({ navigation, route }: ChangeLanguageModalProps): ReactElement => {
  const { languages, availableLanguages } = route.params
  const { languageCode, changeLanguageCode } = useContext(AppContext)
  const [query, setQuery] = useState('')
  const theme = useTheme()

  const currentLanguageName = languages.find(lang => lang.code === languageCode)?.name

  useEffect(() => {
    loadPolyfillIfNeeded(languageCode)
  }, [languageCode])

  const filteredLanguages = useMemo(() => {
    if (query === '') {
      return languages
    }
    const languageNamesInCurrentLanguage = new Intl.DisplayNames([languageCode], { type: 'language' })
    const languageNamesInFallbackLanguage = new Intl.DisplayNames([config.sourceLanguage], { type: 'language' })
    return languages.filter(item =>
      filterLanguages(item, query, languageNamesInCurrentLanguage, languageNamesInFallbackLanguage),
    )
  }, [languages, query, languageCode])

  const selectorItems = filteredLanguages.map(({ code, name }) => {
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
    <Wrapper contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', gap: 4 }}>
      <Searchbar
        placeholder={currentLanguageName}
        onChangeText={setQuery}
        value={query}
        right={() => undefined}
        style={
          theme.dark
            ? {
                backgroundColor: theme.colors.tertiary,
                color: theme.colors.onTertiary,
              }
            : {
                backgroundColor: theme.colors.surfaceVariant,
                color: theme.colors.onSurfaceVariant,
              }
        }
      />
      <Selector selectedItemCode={languageCode} items={selectorItems} />
    </Wrapper>
  )
}

export default ChangeLanguageModal
