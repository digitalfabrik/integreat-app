import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { LANDING_ROUTE, pathnameFromRouteInformation } from 'shared'

import buildConfig from '../constants/buildConfig'
import Header from './Header'
import HeaderActionItem from './HeaderActionItem'

type GeneralHeaderProps = {
  languageCode: string
}

const GeneralHeader = ({ languageCode }: GeneralHeaderProps): ReactElement => {
  const { t } = useTranslation('layout')
  const landingPath = pathnameFromRouteInformation({ route: LANDING_ROUTE, languageCode })
  const actionItems = buildConfig().featureFlags.fixedCity
    ? []
    : [<HeaderActionItem key='landing' to={landingPath} icon={<LocationOnOutlinedIcon />} text={t('changeLocation')} />]

  return <Header logoHref={landingPath} actionItems={actionItems} language={languageCode} />
}

export default GeneralHeader
