import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import SVG from 'react-inlinesvg'

import buildConfig from '../constants/buildConfig'
import useDimensions from '../hooks/useDimensions'
import Link from './base/Link'

const StyledLink = styled(Link)(({ theme }) => ({
  order: 1,

  [theme.breakpoints.up('md')]: {
    height: 48,
  },

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
  const { mobile } = useDimensions()

  return (
    <StyledLink to={link}>
      <StyledLogo src={mobile ? srcMobile : src} title={appName} />
    </StyledLink>
  )
}

export default HeaderLogo
