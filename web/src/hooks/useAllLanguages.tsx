import { createCitiesEndpoint, LanguageModel, useLoadFromEndpoint } from 'shared/api'

import { cmsApiBaseUrl } from '../constants/urls'

const useAllLanguages = (): LanguageModel[] => {
  const { data: cities } = useLoadFromEndpoint(createCitiesEndpoint, cmsApiBaseUrl, undefined)
  return [
    ...new Map(
      cities
        ?.filter(city => city.live)
        .flatMap(city => city.languages)
        .map(item => [item.code, item]),
    ).values(),
  ].sort((a, b) => a.code.localeCompare(b.code))
}

export default useAllLanguages
