import React from 'react'
import { TFunction, withTranslation } from 'react-i18next'

import { LANDING_ROUTE, pathnameFromRouteInformation } from 'api-client'
import { config } from 'translations'

import landingIcon from '../assets/location-icon.svg'
import buildConfig from '../constants/buildConfig'
import Header from './Header'
import HeaderActionItemLink from './HeaderActionItemLink'

type GeneralHeaderProps = {
  languageCode: string
  viewportSmall: boolean
  t: TFunction
}

const GeneralHeader = ({ languageCode, viewportSmall, t }: GeneralHeaderProps) => {
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
      language={languageCode}
    />
  )
}

export default withTranslation('layout')(GeneralHeader)
