import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import SVG from 'react-inlinesvg'

import buildConfig from '../constants/buildConfig'
import useWindowDimensions from '../hooks/useWindowDimensions'
import Link from './base/Link'

const StyledLink = styled(Link)(({ theme }) => ({
  order: 1,
  height: 48,

  [theme.breakpoints.down('md')]: {
    width: 48,
  },
}))

const StyledLogo = styled(SVG)(({ theme }) => ({
  color: theme.palette.text.primary,
  height: '100%',
  width: 'fit-content',

  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}))

type HeaderLogoProps = {
  link: string
}

export const HeaderLogo = ({ link }: HeaderLogoProps): ReactElement => {
  const { campaign, appName, icons } = buildConfig()

  const currentDate = DateTime.now()
  const showCampaignLogo =
    campaign && currentDate > DateTime.fromISO(campaign.startDate) && currentDate < DateTime.fromISO(campaign.endDate)
  const src = showCampaignLogo ? campaign.campaignAppLogo : icons.appLogo
  const srcMobile = showCampaignLogo ? campaign.campaignAppLogoMobile : icons.appLogoMobile
  const { viewportSmall } = useWindowDimensions()

  return (
    <StyledLink to={link}>
      <StyledLogo src={viewportSmall ? srcMobile : src} title={appName} />
    </StyledLink>
  )
}

export default HeaderLogo
