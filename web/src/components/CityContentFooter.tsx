import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { DISCLAIMER_ROUTE, LICENSES_ROUTE, pathnameFromRouteInformation } from 'api-client'

import buildConfig from '../constants/buildConfig'
import CleanLink from './CleanLink'
import Footer from './Footer'

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
    border-bottom: 1px solid #b1b1b1;
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
  const { aboutUrls, privacyUrls } = buildConfig()
  const { t } = useTranslation(['layout', 'settings'])
  const aboutUrl = aboutUrls[language] || aboutUrls.default
  const privacyUrl = privacyUrls[language] || privacyUrls.default
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
      <CleanLink to={disclaimerPath}>{t('imprintAndContact')}</CleanLink>
      <CleanLink to={aboutUrl}>{t('settings:about', { appName: buildConfig().appName })}</CleanLink>
      <CleanLink to={privacyUrl}>{t('privacy')}</CleanLink>
      <CleanLink to={licensesPath}>{t('settings:openSourceLicenses')}</CleanLink>
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
