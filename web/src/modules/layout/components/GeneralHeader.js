// @flow

import React from 'react'
import landingIcon from '../assets/location-icon.svg'
import Header from './Header'
import HeaderActionItemLink from './HeaderActionItemLink'
import I18nRedirectRouteConfig from '../../app/route-configs/I18nRedirectRouteConfig'
import { withTranslation, type TFunction } from 'react-i18next'
import buildConfig from '../../app/constants/buildConfig'

type PropsType = {|
  viewportSmall: boolean,
  t: TFunction
|}

const GeneralHeader = ({ viewportSmall, t }: PropsType) => {
  const getPath = new I18nRedirectRouteConfig().getRoutePath

  const actionItems = !buildConfig().featureFlags.fixedCity
    ? [<HeaderActionItemLink key='landing'
                               href={getPath({})}
                               iconSrc={landingIcon}
                               text={t('changeLocation')} />]
    : []

  const onStickyTopChanged = () => {}

  return <Header viewportSmall={viewportSmall}
                 onStickyTopChanged={onStickyTopChanged}
                 logoHref={getPath({})}
                 actionItems={actionItems} />
}

export default withTranslation<PropsType>('layout')(GeneralHeader)
