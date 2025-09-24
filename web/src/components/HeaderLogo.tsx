import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import SVG from 'react-inlinesvg'

import buildConfig from '../constants/buildConfig'
import useDimensions from '../hooks/useDimensions'
import Link from './base/Link'

type HeaderLogoProps = {
  link: string
}

const StyledLink = styled(Link)`
  order: 1;
  height: 48px;

  ${props => props.theme.breakpoints.down('md')} {
    width: 32px;
  }
`

const StyledLogo = styled(SVG)`
  color: ${props => props.theme.legacy.colors.textColor};
  height: 100%;
  width: fit-content;

  ${props => props.theme.breakpoints.down('md')} {
    width: 100%;
  }
`

export const HeaderLogo = ({ link }: HeaderLogoProps): ReactElement => {
  const { campaign, appName, icons } = buildConfig()

  const currentDate = DateTime.now()
  const showCampaignLogo =
    campaign && currentDate > DateTime.fromISO(campaign.startDate) && currentDate < DateTime.fromISO(campaign.endDate)
  const src = showCampaignLogo ? campaign.campaignAppLogo : icons.appLogo
  const srcMobile = showCampaignLogo ? campaign.campaignAppLogoMobile : icons.appLogoMobile
  const { mobile } = useDimensions()

  return (
    <StyledLink to={link}>
      <StyledLogo src={mobile ? srcMobile : src} title={appName} />
    </StyledLink>
  )
}

export default HeaderLogo
