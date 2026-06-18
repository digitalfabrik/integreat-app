import { shouldPolyfill } from '@formatjs/intl-displaynames/should-polyfill'
import '@formatjs/intl-locale/polyfill'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import styled from 'styled-components/native'

import { filterLanguages, LanguagesRouteType } from 'shared'
import { config } from 'translations'

import SearchInput from '../components/SearchInput'
import Selector from '../components/Selector'
import AlertDialog from '../components/base/AlertDialog'
import Text from '../components/base/Text'
import { NavigationProps, RouteProps } from '../constants/NavigationTypes'
import { AppContext } from '../contexts/AppContext'
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

type LanguageSelectionProps = {
  route: RouteProps<LanguagesRouteType>
  navigation: NavigationProps<LanguagesRouteType>
}

const LanguageSelection = ({ navigation, route }: LanguageSelectionProps): ReactElement => {
  const { languages, availableLanguages } = route.params
  const { languageCode, changeLanguageCode } = useContext(AppContext)
  const [query, setQuery] = useState('')
  const [polyfillLoaded, setPolyfillLoaded] = useState(false)
  const [isUnavailableDialogOpen, setIsUnavailableDialogOpen] = useState(false)
  const { t } = useTranslation('layout')

  const currentLanguageName = languages.find(lang => lang.code === languageCode)?.name

  useEffect(() => {
    loadPolyfillIfNeeded(languageCode).then(() => setPolyfillLoaded(true))
  }, [languageCode])

  const getFilteredLanguages = () => {
    if (!polyfillLoaded) {
      return languages
    }
    return filterLanguages(languages, query, languageCode, config.sourceLanguage)
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
        <SearchInput
          setValue={setQuery}
          value={query}
          placeholderText={currentLanguageName}
          style={styles.horizontalMargin}
        />
        <Selector selectedItemCode={languageCode} items={selectorItems} />
        <Button mode='outlined' onPress={() => setIsUnavailableDialogOpen(true)} style={styles.horizontalMargin}>
          {t('languageNotFoundQuestion')}
        </Button>
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

export default LanguageSelection
