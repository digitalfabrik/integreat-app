import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import dimensions from '../constants/dimensions'
import Link from './base/Link'
import Tooltip from './base/Tooltip'

const LONG_TITLE_LENGTH = 25
export const HEADER_TITLE_HEIGHT = 50

const HeaderTitleContainer = styled(Typography)`
  display: flex;
  align-items: flex-start;
  max-height: ${dimensions.headerHeightLarge};
  flex: 1;
  order: 2;

  ${props => props.theme.breakpoints.up('md')} {
    padding-bottom: 8px;
  }
`

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;

  ${props => props.theme.breakpoints.down('md')} {
    gap: 0;
  }
`

type HeaderTitleProps = {
  title: string
  landingPath: string
}

const HeaderTitle = ({ title, landingPath }: HeaderTitleProps): ReactElement => {
  const { t } = useTranslation('layout')
  return (
    <HeaderTitleContainer
      aria-label={t('changeLocation')}
      variant={title.length >= LONG_TITLE_LENGTH ? 'title3' : 'title2'}>
      <Tooltip id='location' place='left' tooltipContent={t('changeLocation')}>
        <StyledLink to={landingPath}>
          {title} <KeyboardArrowDownIcon />
        </StyledLink>
      </Tooltip>
    </HeaderTitleContainer>
  )
}

export default HeaderTitle
