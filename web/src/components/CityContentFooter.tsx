import styled from '@emotion/styled'
import Divider from '@mui/material/Divider'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { DISCLAIMER_ROUTE, LICENSES_ROUTE, pathnameFromRouteInformation } from 'shared'

import buildConfig from '../constants/buildConfig'
import useWindowDimensions from '../hooks/useWindowDimensions'
import Footer from './Footer'
import Link from './base/Link'

const SidebarFooterContainer = styled.div`
  width: 100%;
  margin-top: -10px; /* to counteract the padding-top of the normal footer */
  padding: 0 27px;

  > a {
    color: ${props => props.theme.legacy.colors.textColor};
    padding: 16px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

type CityContentFooterProps = {
  city: string
  language: string
  mode?: 'normal' | 'overlay' | 'sidebar'
}

const CityContentFooter = ({ city, language, mode = 'normal' }: CityContentFooterProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
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

  const linkItems = [
    { to: disclaimerPath, text: t('disclaimer') },
    { to: aboutUrl, text: t('settings:about', { appName: buildConfig().appName }) },
    { to: privacyUrl, text: t('privacy') },
    { to: licensesPath, text: t('settings:openSourceLicenses') },
    ...(accessibilityUrl ? [{ to: accessibilityUrl, text: t('accessibility') }] : []),
  ]
  const Links = (
    <>
      {linkItems.map((item, index) => (
        <React.Fragment key={item.to}>
          <Link to={item.to}>{item.text}</Link>
          {viewportSmall && index < linkItems.length - 1 && <Divider />}
        </React.Fragment>
      ))}
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
