import LocationOnIcon from '@mui/icons-material/LocationOn'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { LANDING_ROUTE, pathnameFromRouteInformation } from 'shared'

import buildConfig from '../constants/buildConfig'
import Header from './Header'
import HeaderActionItemLink from './HeaderActionItemLink'

type GeneralHeaderProps = {
  languageCode: string
}

const GeneralHeader = ({ languageCode }: GeneralHeaderProps): ReactElement => {
  const { t } = useTranslation('layout')
  const landingPath = pathnameFromRouteInformation({ route: LANDING_ROUTE, languageCode })
  const actionItems = buildConfig().featureFlags.fixedCity
    ? []
    : [<HeaderActionItemLink key='landing' to={landingPath} iconSrc={LocationOnIcon} text={t('changeLocation')} />]

  return (
    <Header
      logoHref={landingPath}
      actionItems={actionItems}
      navigationItems={[]}
      kebabItems={[]}
      language={languageCode}
    />
  )
}

export default GeneralHeader
