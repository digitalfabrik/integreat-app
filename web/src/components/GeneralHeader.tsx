import React, { ReactElement } from 'react'
import { useLocation } from 'react-router-dom'

import { LANDING_ROUTE, pathnameFromRouteInformation } from 'shared'
import { createCitiesEndpoint, useLoadFromEndpoint } from 'shared/api'

import { cmsApiBaseUrl } from '../constants/urls'
import Header from './Header'
import HeaderLanguageSelectorItem from './HeaderLanguageSelectorItem'

type GeneralHeaderProps = {
  languageCode: string
}

const GeneralHeader = ({ languageCode }: GeneralHeaderProps): ReactElement => {
  const { data: cities } = useLoadFromEndpoint(createCitiesEndpoint, cmsApiBaseUrl, undefined)
  const landingPath = pathnameFromRouteInformation({ route: LANDING_ROUTE, languageCode })
  const slug = useLocation().pathname.split('/')[1]
  const languages = [
    ...new Map(cities?.flatMap(city => (city.live ? city.languages : [])).map(item => [item.code, item])).values(),
  ]
  const languageChangePaths = languages.map(language => ({
    code: language.code,
    name: language.name,
    path: `/${slug}/${language.code}`,
  }))

  const actionItems =
    languageChangePaths.length > 0
      ? [
          <HeaderLanguageSelectorItem
            key='languageChange'
            languageChangePaths={languageChangePaths}
            languageCode={languageCode}
            forceText
          />,
        ]
      : []

  return <Header logoHref={landingPath} actionItems={actionItems} language={languageCode} />
}

export default GeneralHeader
