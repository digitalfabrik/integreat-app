import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { DISCLAIMER_ROUTE, LICENSES_ROUTE, pathnameFromRouteInformation } from 'api-client'

import buildConfig from '../constants/buildConfig'
import CleanLink from './CleanLink'
import Footer from './Footer'

const SidebarFooterContainer = styled.div`
  width: 100%;
  margin: -10px 12px 0 23px;
  > * {
    color: ${props => props.theme.colors.textColor};
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center; /* the text is centered, the lines between are not */
    padding-right: 5.5px;
    border-bottom: 1px solid ${props => props.theme.colors.textSecondaryColor};
    &:last-child {
      border-bottom: none;
    }
  }
`

type CityContentFooterProps = {
  city: string
  language: string
  overlay?: boolean
  inSidebar?: boolean
}

const CityContentFooter: React.FC<CityContentFooterProps> = ({
  city,
  language,
  overlay = false,
  inSidebar = false,
}: CityContentFooterProps): ReactElement => {
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

  if (inSidebar) {
    return (
      <Footer>
        <SidebarFooterContainer>
          <CleanLink to={disclaimerPath}>{t('imprintAndContact')}</CleanLink>
          <CleanLink to={aboutUrl}>{t('settings:about', { appName: buildConfig().appName })}</CleanLink>
          <CleanLink to={privacyUrl}>{t('privacy')}</CleanLink>
          <CleanLink to={licensesPath}>{t('settings:openSourceLicenses')}</CleanLink>
        </SidebarFooterContainer>
      </Footer>
    )
  }

  return (
    <Footer overlay={overlay}>
      <CleanLink to={disclaimerPath}>{t('imprintAndContact')}</CleanLink>
      <CleanLink to={aboutUrl}>{t('settings:about', { appName: buildConfig().appName })}</CleanLink>
      <CleanLink to={privacyUrl}>{t('privacy')}</CleanLink>
      <CleanLink to={licensesPath}>{t('settings:openSourceLicenses')}</CleanLink>
    </Footer>
  )
}

export default CityContentFooter
