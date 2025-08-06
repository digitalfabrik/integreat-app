import styled from '@emotion/styled'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import Tooltip from '@mui/material/Tooltip'
import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import Icon from './base/Icon'
import Link from './base/Link'

const Container = styled.div`
  position: absolute;
  inset-inline-end: -27px;
  top: 4px;
`

const IconContainer = styled.button`
  padding: 0;
  border: none;
  background-color: transparent;
  width: 18px;
  height: 18px;
`

const StyledIcon = styled(Icon)`
  width: 18px;
  height: 18px;
  align-self: center;
`

const TooltipContent = styled.span`
  ${props => props.theme.breakpoints.down('md')} {
    font-size: 14px;
  }
`

const TooltipTitle = styled.div`
  font-weight: 700;
  margin-bottom: 8px;

  ${props => props.theme.breakpoints.down('md')} {
    font-size: 14px;
  }
`

const StyledLink = styled(Link)`
  color: ${props => props.theme.palette.text.primary};
`

type AppointmentOnlyIconProps = {
  appointmentUrl: string | null
}

const AppointmentOnlyIcon = ({ appointmentUrl }: AppointmentOnlyIconProps): ReactElement => {
  const { t } = useTranslation('pois')

  return (
    <Container>
      <Tooltip
        title={
          <>
            <TooltipTitle>{t('appointmentNecessary')}</TooltipTitle>
            <TooltipContent>
              <Trans i18nKey='pois:makeAppointmentTooltipWithLink'>
                This gets replaced
                {appointmentUrl ? (
                  <StyledLink to={appointmentUrl} highlighted>
                    by react-i18next
                  </StyledLink>
                ) : (
                  <span>by react-i18next</span>
                )}
              </Trans>
            </TooltipContent>
          </>
        }>
        <IconContainer title={t('appointmentNecessary')}>
          <StyledIcon src={ErrorOutlineOutlinedIcon} />
        </IconContainer>
      </Tooltip>
    </Container>
  )
}

export default AppointmentOnlyIcon
