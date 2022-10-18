import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { LANDING_ROUTE, pathnameFromRouteInformation } from 'api-client'
import { config } from 'translations'

import landingIcon from '../assets/location-icon.svg'
import buildConfig from '../constants/buildConfig'
import Header from './Header'
import HeaderActionItemLink from './HeaderActionItemLink'

type PropsType = {
  languageCode: string
  viewportSmall: boolean
}

const GeneralHeader = ({ languageCode, viewportSmall }: PropsType): ReactElement => {
  const { t } = useTranslation('layout')

  const landingPath = pathnameFromRouteInformation({ route: LANDING_ROUTE, languageCode })
  const actionItems = !buildConfig().featureFlags.fixedCity
    ? [<HeaderActionItemLink key='landing' href={landingPath} iconSrc={landingIcon} text={t('changeLocation')} />]
    : []

  return (
    <Header
      viewportSmall={viewportSmall}
      logoHref={landingPath}
      actionItems={actionItems}
      navigationItems={[]}
      kebabItems={[]}
      direction={config.getScriptDirection(languageCode)}
    />
  )
}

export default GeneralHeader
