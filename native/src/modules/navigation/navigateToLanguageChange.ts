import { NavigationPropType, RoutesType } from '../app/constants/NavigationTypes'
import { CHANGE_LANGUAGE_MODAL_ROUTE } from 'api-client/src/routes'
import { LanguageModel, OPEN_PAGE_SIGNAL_NAME } from 'api-client'
import sendTrackingSignal from '../endpoint/sendTrackingSignal'

const navigateToLanguageChange = <T extends RoutesType>({
  navigation,
  cityCode,
  languageCode,
  languages,
  availableLanguages,
  previousKey
}: {
  navigation: NavigationPropType<T>
  cityCode: string
  languageCode: string
  previousKey: string
  languages: Array<LanguageModel>
  availableLanguages: Array<string>
}) => {
  sendTrackingSignal({
    signal: {
      name: OPEN_PAGE_SIGNAL_NAME,
      pageType: CHANGE_LANGUAGE_MODAL_ROUTE,
      url: ''
    }
  })
  navigation.navigate({
    name: CHANGE_LANGUAGE_MODAL_ROUTE,
    params: {
      currentLanguage: languageCode,
      languages,
      cityCode,
      availableLanguages,
      previousKey
    }
  })
}

export default navigateToLanguageChange
