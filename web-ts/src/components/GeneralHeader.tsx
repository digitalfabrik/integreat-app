import React from 'react'
import landingIcon from '../assets/location-icon.svg'
import Header from './Header'
import HeaderActionItemLink from './HeaderActionItemLink'
import { withTranslation, TFunction } from 'react-i18next'
import buildConfig from '../constants/buildConfig'
import { RoutePatterns } from '../routes/RootSwitcher'
import { LANDING_ROUTE } from '../../../api-client'
import { generatePath } from 'react-router-dom'

type PropsType = {
  languageCode: string
  viewportSmall: boolean
  t: TFunction
}

const GeneralHeader = ({ languageCode, viewportSmall, t }: PropsType) => {
  const landingPath = generatePath(RoutePatterns[LANDING_ROUTE], { languageCode })
  const actionItems = !buildConfig().featureFlags.fixedCity
    ? [<HeaderActionItemLink key='landing' href={landingPath} iconSrc={landingIcon} text={t('changeLocation')} />]
    : []

  const onStickyTopChanged = () => {}

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
