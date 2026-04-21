import { shouldPolyfill } from '@formatjs/intl-displaynames/should-polyfill'
import '@formatjs/intl-locale/polyfill'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { Button, Searchbar, useTheme } from 'react-native-paper'
import styled from 'styled-components/native'

import { ChangeLanguageModalRouteType, normalizeString } from 'shared'
import { LanguageModel } from 'shared/api'
import { config } from 'translations'

import Selector from '../components/Selector'
import AlertDialog from '../components/base/AlertDialog'
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

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    gap: 4,
  },
  horizontalMargin: {
    marginHorizontal: 16,
    marginTop: 8,
  },
})

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
  const searchbarTextColor = theme.dark ? theme.colors.background : theme.colors.onBackground

  useEffect(() => {
    loadPolyfillIfNeeded(languageCode).then(() => setPolyfillLoaded(true))
  }, [languageCode])

  const getFilteredLanguages = () => {
    if (query === '' || !polyfillLoaded) {
      return languages
    }
    const languageNamesForFilter = new Intl.DisplayNames([languageCode], { type: 'language' })
    const languageNamesInFallbackLanguage = new Intl.DisplayNames([config.sourceLanguage], { type: 'language' })
    return languages.filter(item =>
      filterLanguages(item, query, languageNamesForFilter, languageNamesInFallbackLanguage),
    )
  }

  const filteredLanguages = getFilteredLanguages()

  const languageNamesInCurrentLanguage = polyfillLoaded
    ? new Intl.DisplayNames([languageCode], { type: 'language' })
    : undefined
  const selectorItems = filteredLanguages.map(({ code, name }) => {
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

  return (
    <>
      <Wrapper contentContainerStyle={styles.contentContainer}>
        <Searchbar
          placeholder={currentLanguageName}
          onChangeText={setQuery}
          value={query}
          placeholderTextColor={searchbarTextColor}
          iconColor={searchbarTextColor}
          right={() => undefined}
          inputStyle={{ color: searchbarTextColor }}
          style={[
            styles.horizontalMargin,
            { backgroundColor: theme.dark ? theme.colors.tertiary : theme.colors.surfaceVariant },
          ]}
        />
        {filteredLanguages.length === 0 ? (
          <Button mode='outlined' onPress={() => setIsUnavailableDialogOpen(true)} style={styles.horizontalMargin}>
            {t('languageNotFoundQuestion')}
          </Button>
        ) : (
          <Selector selectedItemCode={languageCode} items={selectorItems} />
        )}
      </Wrapper>
      <AlertDialog
        visible={isUnavailableDialogOpen}
        close={() => setIsUnavailableDialogOpen(false)}
        title={<Text variant='subtitle1'>{t('noTranslation')}</Text>}>
        <Text>{t('languageNotAvailableMessage')}</Text>
      </AlertDialog>
    </>
  )
}

export default ChangeLanguageModal
