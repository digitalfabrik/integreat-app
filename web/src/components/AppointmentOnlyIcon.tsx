import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { styled } from 'styled-components'

import { NoteIcon } from '../assets'
import dimensions from '../constants/dimensions'
import Icon from './base/Icon'
import Tooltip from './base/Tooltip'

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
  @media ${dimensions.smallViewport} {
    font-size: 14px;
  }
`

const TooltipTitle = styled.div`
  font-weight: 700;
  margin-bottom: 8px;

  @media ${dimensions.smallViewport} {
    font-size: 14px;
  }
`

type AppointmentOnlyIconProps = {
  appointmentUrl: string | null
}

const AppointmentOnlyIcon = ({ appointmentUrl }: AppointmentOnlyIconProps): ReactElement => {
  const { t } = useTranslation('pois')

  return (
    <Container>
      <Tooltip
        id='appointment'
        clickable
        style={{
          width: '250px',
        }}
        tooltipContent={
          <>
            <TooltipTitle>{t('appointmentNecessary')}</TooltipTitle>
            <TooltipContent>
              {/* More information: https://react.i18next.com/latest/trans-component */}
              <Trans i18nKey='pois:makeAppointmentTooltipWithLink'>
                This gets replaced by react-i18next.
                {appointmentUrl ? <Link to={appointmentUrl}>{t('theWebsite')}</Link> : <span>{t('theWebsite')}</span>}
              </Trans>
            </TooltipContent>
          </>
        }>
        <IconContainer title={t('appointmentNecessary')}>
          <StyledIcon src={NoteIcon} />
        </IconContainer>
      </Tooltip>
    </Container>
  )
}

export default AppointmentOnlyIcon
