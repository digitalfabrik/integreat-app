import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled, Theme } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import buildConfig from '../constants/buildConfig'
import Link from './base/Link'

const LONG_TITLE_LENGTH = 25

const HeaderTitleContainer = styled(Typography)`
  display: flex;
  align-items: flex-start;
  margin-inline-end: auto;
  order: 2;

  /* Used margin-inline-end to let Tooltip be in the center of the title and flex:1 for small screens. */
  ${props => props.theme.breakpoints.down('sm')} {
    margin-inline-end: 0;
    flex: 1;
  }
`

const titleStyles = ({ theme }: { theme: Theme }) => `
  display: flex;
  align-items: center;
  gap: 12px;

  ${theme.breakpoints.down('md')} {
    gap: 0;
  }
`

const StyledLink = styled(Link)`
  ${titleStyles}
`

const StyledTitle = styled('span')`
  ${titleStyles}
`

type HeaderTitleProps = {
  title: string
  landingPath: string
}

const HeaderTitle = ({ title, landingPath }: HeaderTitleProps): ReactElement => {
  const { t } = useTranslation('layout')
  const { featureFlags } = buildConfig()
  const isFixedCity = featureFlags.fixedCity
  const variant = title.length >= LONG_TITLE_LENGTH ? 'title3' : 'title2'

  if (isFixedCity) {
    return (
      <HeaderTitleContainer aria-label={t('changeLocation')} variant={variant}>
        <StyledTitle>{title}</StyledTitle>
      </HeaderTitleContainer>
    )
  }
  return (
    <Tooltip id='location' title={t('changeLocation')}>
      <HeaderTitleContainer variant={variant}>
        <StyledLink to={landingPath}>
          {title}
          <KeyboardArrowDownIcon />
        </StyledLink>
      </HeaderTitleContainer>
    </Tooltip>
  )
}

export default HeaderTitle
