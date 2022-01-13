import React from 'react'
import { TFunction, withTranslation } from 'react-i18next'

import { LANDING_ROUTE, pathnameFromRouteInformation } from 'api-client'

import landingIcon from '../assets/location-icon.svg'
import buildConfig from '../constants/buildConfig'
import Header from './Header'
import HeaderActionItemLink from './HeaderActionItemLink'

type PropsType = {
  languageCode: string
  viewportSmall: boolean
  t: TFunction
}

const GeneralHeader = ({ languageCode, viewportSmall, t }: PropsType) => {
  const landingPath = pathnameFromRouteInformation({ route: LANDING_ROUTE, languageCode })
  const actionItems = !buildConfig().featureFlags.fixedCity
    ? [<HeaderActionItemLink key='landing' href={landingPath} iconSrc={landingIcon} text={t('changeLocation')} />]
    : []

  const onStickyTopChanged = () => undefined

  return (
    <Header
      viewportSmall={viewportSmall}
      onStickyTopChanged={onStickyTopChanged}
      logoHref={landingPath}
      actionItems={actionItems}
      navigationItems={[]}
    />
  )
}

export default withTranslation('layout')(GeneralHeader)
