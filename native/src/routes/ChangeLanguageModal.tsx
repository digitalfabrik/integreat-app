import { shouldPolyfill } from '@formatjs/intl-displaynames/should-polyfill'
import '@formatjs/intl-locale/polyfill'
import React, { ReactElement, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Dialog, Portal, Searchbar, useTheme } from 'react-native-paper'
import styled from 'styled-components/native'

import { ChangeLanguageModalRouteType, normalizeString } from 'shared'
import { LanguageModel } from 'shared/api'
import { config } from 'translations'

import Selector from '../components/Selector'
import Text from '../components/base/Text'
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
  background-color: ${props => props.theme.colors.background};
`

type ChangeLanguageModalProps = {
  route: RouteProps<ChangeLanguageModalRouteType>
  navigation: NavigationProps<ChangeLanguageModalRouteType>
}

const ChangeLanguageModal = ({ navigation, route }: ChangeLanguageModalProps): ReactElement => {
  const { languages, availableLanguages } = route.params
  const { languageCode, changeLanguageCode } = useContext(AppContext)
  const [query, setQuery] = useState('')
  const [polyfillLoaded, setPolyfillLoaded] = useState(false)
  const [isUnavailableDialogOpen, setIsUnavailableDialogOpen] = useState(false)
  const theme = useTheme()
  const { t } = useTranslation('layout')

  const currentLanguageName = languages.find(lang => lang.code === languageCode)?.name

  useEffect(() => {
    loadPolyfillIfNeeded(languageCode).then(() => setPolyfillLoaded(true))
  }, [languageCode])

  const allLanguages = useMemo(() => {
    const cityCodes = new Set(languages.map(language => language.code))
    const unsupported = Object.entries(config.supportedLanguages)
      .filter(([code]) => !cityCodes.has(code))
      .map(([code, { name }]) => ({ code, name }) as LanguageModel)
    return [...languages, ...unsupported]
  }, [languages])

  const filteredLanguages = useMemo(() => {
    if (query === '') {
      return allLanguages
    }
    const languageNamesInCurrentLanguage = new Intl.DisplayNames([languageCode], { type: 'language' })
    const languageNamesInFallbackLanguage = new Intl.DisplayNames([config.sourceLanguage], { type: 'language' })
    return allLanguages.filter(item =>
      filterLanguages(item, query, languageNamesInCurrentLanguage, languageNamesInFallbackLanguage),
    )
  }, [allLanguages, query, languageCode])

  const selectorItems = useMemo(() => {
    const languageNamesInCurrentLanguage = polyfillLoaded
      ? new Intl.DisplayNames([languageCode], { type: 'language' })
      : undefined
    return filteredLanguages.map(({ code, name }) => {
      const isLanguageAvailable = availableLanguages.includes(code)
      return new SelectorItemModel({
        code,
        name,
        enabled: isLanguageAvailable,
        accessibilityLabel: languageNamesInCurrentLanguage?.of(code) ?? name,
        onPress: isLanguageAvailable
          ? () => {
              if (code !== languageCode) {
                changeLanguageCode(code)
              }
              navigation.goBack()
            }
          : () => setIsUnavailableDialogOpen(true),
      })
    })
  }, [filteredLanguages, availableLanguages, languageCode, changeLanguageCode, navigation, polyfillLoaded])

  return (
    <>
      <Wrapper contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', gap: 4 }}>
        <Searchbar
          placeholder={currentLanguageName}
          onChangeText={setQuery}
          value={query}
          right={() => undefined}
          inputStyle={{ color: theme.dark ? theme.colors.background : theme.colors.onBackground }}
          style={{
            marginHorizontal: 16,
            backgroundColor: theme.dark ? theme.colors.tertiary : theme.colors.surfaceVariant,
          }}
        />
        <Selector selectedItemCode={languageCode} items={selectorItems} />
      </Wrapper>
      <Portal>
        <Dialog
          visible={isUnavailableDialogOpen}
          onDismiss={() => setIsUnavailableDialogOpen(false)}
          style={{ backgroundColor: theme.colors.surfaceVariant }}>
          <Dialog.Title>{t('languageNotAvailableTitle')}</Dialog.Title>
          <Dialog.Content>
            <Text>{t('languageNotAvailableMessage')}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsUnavailableDialogOpen(false)}>{t('common:close')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  )
}

export default ChangeLanguageModal
