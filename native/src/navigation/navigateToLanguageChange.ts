import { LanguageModel, OPEN_PAGE_SIGNAL_NAME } from 'api-client'
import { CHANGE_LANGUAGE_MODAL_ROUTE } from 'api-client/src/routes'

import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import sendTrackingSignal from '../utils/sendTrackingSignal'

const navigateToLanguageChange = <T extends RoutesType>({
  navigation,
  cityCode,
  languageCode,
  languages,
  availableLanguages,
  previousKey,
}: {
  navigation: NavigationProps<T>
  cityCode: string
  languageCode: string
  previousKey: string
  languages: Array<LanguageModel>
  availableLanguages: Array<string>
}): void => {
  sendTrackingSignal({
    signal: {
      name: OPEN_PAGE_SIGNAL_NAME,
      pageType: CHANGE_LANGUAGE_MODAL_ROUTE,
      url: '',
    },
  })
  navigation.navigate({
    name: CHANGE_LANGUAGE_MODAL_ROUTE,
    params: {
      currentLanguage: languageCode,
      languages,
      cityCode,
      availableLanguages,
      previousKey,
    },
  })
}

export default navigateToLanguageChange
