import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AccessibilityInfo, Platform } from 'react-native'

import { CityModel, ExtendedPageModel } from 'shared/api'

const useAnnounceSearchResultsIOS = <T>(searchResults: T[] | null): void => {
  const { t } = useTranslation('search')

  useEffect(() => {
    // iOS doesn't have live regions to inform a user with a screenreader that there are no more search results
    if (searchResults?.length === 0 && Platform.OS === 'ios') {
      AccessibilityInfo.announceForAccessibility(t('searchResultsCount', { count: 0 }))
    }
  }, [searchResults, t])
}

export default useAnnounceSearchResultsIOS
