import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { DISCLAIMER_ROUTE, LICENSES_ROUTE, pathnameFromRouteInformation } from 'shared'

import buildConfig from '../constants/buildConfig'
import Footer from './Footer'
import Link from './base/Link'
import List from './base/List'

const StyledList = styled(List)`
  padding: 0;
`

const StyledListItem = styled(ListItem)`
  padding: 0;
  width: fit-content;

  ${props => props.theme.breakpoints.down('md')} {
    width: 100%;
  }
`

const StyledTypography = styled(Typography)`
  text-align: center;
`

const SidebarFooterContainer = styled('div')`
  width: 100%;
  margin-top: -10px; /* to counteract the padding-top of the normal footer */
  padding: 0 27px;
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

  const linkItems = [
    { to: disclaimerPath, text: t('imprint') },
    { to: aboutUrl, text: t('settings:about', { appName: buildConfig().appName }) },
    { to: privacyUrl, text: t('privacy') },
    { to: licensesPath, text: t('settings:openSourceLicenses') },
    ...(accessibilityUrl ? [{ to: accessibilityUrl, text: t('accessibility') }] : []),
  ]

  const linkListItems = linkItems.map(item => {
    const { to, text } = item
    return (
      <StyledListItem key={to}>
        <ListItemButton component={Link} to={to}>
          <ListItemText primary={<StyledTypography variant='body2'>{text}</StyledTypography>} />
        </ListItemButton>
      </StyledListItem>
    )
  })

  const LinksList = <StyledList NoItemsMessage='' items={linkListItems} horizontal={mode !== 'sidebar'} />

  if (mode === 'sidebar') {
    return (
      <Footer>
        <SidebarFooterContainer>{LinksList}</SidebarFooterContainer>
      </Footer>
    )
  }

  return <Footer overlay={mode === 'overlay'}>{LinksList}</Footer>
}

export default CityContentFooter
