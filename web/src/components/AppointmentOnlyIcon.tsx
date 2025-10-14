import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import Link from './base/Link'

const StyledLink = styled(Link)`
  color: ${props => props.theme.palette.text.primary};
`

type AppointmentOnlyIconProps = {
  appointmentUrl: string | null
}

const AppointmentOnlyIcon = ({ appointmentUrl }: AppointmentOnlyIconProps): ReactElement => {
  const { t } = useTranslation('pois')

  return (
    <Tooltip
      title={
        <Stack>
          <Typography variant='subtitle1'>{t('appointmentNecessary')}</Typography>
          <Typography variant='body2'>
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
          </Typography>
        </Stack>
      }>
      <ErrorOutlineOutlinedIcon fontSize='small' />
    </Tooltip>
  )
}

export default AppointmentOnlyIcon
