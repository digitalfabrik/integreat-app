import { CHANGE_LANGUAGE_MODAL_ROUTE, OPEN_PAGE_SIGNAL_NAME } from 'shared'
import { LanguageModel } from 'shared/api'

import { NavigationProps, RoutesType } from '../constants/NavigationTypes'
import sendTrackingSignal from '../utils/sendTrackingSignal'

const navigateToLanguageChange = <T extends RoutesType>({
  navigation,
  languages,
  availableLanguages,
}: {
  navigation: NavigationProps<T>
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
      languages,
      availableLanguages,
    },
  })
}

export default navigateToLanguageChange
