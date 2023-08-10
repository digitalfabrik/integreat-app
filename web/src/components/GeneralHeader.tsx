import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { LANDING_ROUTE, pathnameFromRouteInformation } from 'api-client'
import { config } from 'translations'

import { LocationIcon } from '../assets'
import buildConfig from '../constants/buildConfig'
import Header from './Header'
import HeaderActionItemLink from './HeaderActionItemLink'

type GeneralHeaderProps = {
  languageCode: string
}

const GeneralHeader = ({ languageCode }: GeneralHeaderProps): ReactElement => {
  const { t } = useTranslation('layout')
  const landingPath = pathnameFromRouteInformation({ route: LANDING_ROUTE, languageCode })
  const actionItems = !buildConfig().featureFlags.fixedCity
    ? [<HeaderActionItemLink key='landing' href={landingPath} iconSrc={LocationIcon} text={t('changeLocation')} />]
    : []

  return (
    <Header
      logoHref={landingPath}
      actionItems={actionItems}
      navigationItems={[]}
      kebabItems={[]}
      direction={config.getScriptDirection(languageCode)}
      language={languageCode}
    />
  )
}

export default GeneralHeader
