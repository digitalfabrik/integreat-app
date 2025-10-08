import styled from '@emotion/styled'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { DISCLAIMER_ROUTE, LICENSES_ROUTE, pathnameFromRouteInformation } from 'shared'

import buildConfig from '../constants/buildConfig'
import Footer from './Footer'
import Link from './base/Link'

const SidebarFooterContainer = styled.div`
  width: 100%;
  margin-top: -10px; /* to counteract the padding-top of the normal footer */
  padding: 0 27px;

  > * {
    color: ${props => props.theme.colors.textColor};
    padding: 16px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid ${props => props.theme.colors.footerLineColor};

    &:last-child {
      border-bottom: none;
    }
  }
`

type CityContentFooterProps = {
  city: string
  language: string
  mode?: 'normal' | 'overlay' | 'sidebar'
}

const CityContentFooter = ({ city, language, mode = 'normal' }: CityContentFooterProps): ReactElement => {
  const { aboutUrls, privacyUrls, accessibilityUrls } = buildConfig()
  const { t } = useTranslation(['layout', 'settings'])
  const aboutUrl = aboutUrls[language] || aboutUrls.default
  const privacyUrl = privacyUrls[language] || privacyUrls.default
  const accessibilityUrl = accessibilityUrls?.[language] ?? accessibilityUrls?.default
  const disclaimerPath = pathnameFromRouteInformation({
    route: DISCLAIMER_ROUTE,
    cityCode: city,
    languageCode: language,
  })
  const licensesPath = pathnameFromRouteInformation({
    route: LICENSES_ROUTE,
  })

  const Links = (
    <>
      <Link to={disclaimerPath}>{t('disclaimer')}</Link>
      <Link to={aboutUrl}>{t('settings:about', { appName: buildConfig().appName })}</Link>
      <Link to={privacyUrl}>{t('privacy')}</Link>
      <Link to={licensesPath}>{t('settings:openSourceLicenses')}</Link>
      {!!accessibilityUrl && <Link to={accessibilityUrl}>{t('accessibility')}</Link>}
    </>
  )

  if (mode === 'sidebar') {
    return (
      <Footer>
        <SidebarFooterContainer>{Links}</SidebarFooterContainer>
      </Footer>
    )
  }

  return <Footer overlay={mode === 'overlay'}>{Links}</Footer>
}

export default CityContentFooter
