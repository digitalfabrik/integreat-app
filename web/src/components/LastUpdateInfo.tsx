import Typography, { TypographyProps } from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { DateTime } from 'luxon'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

const StyledTypography = styled(Typography)<TypographyProps>`
  color: ${props => props.theme.palette.text.secondary};
`

type LastUpdateInfoProps = {
  lastUpdate: DateTime
  withText: boolean
  format?: string
  className?: string
}

export const LastUpdateInfo = ({
  lastUpdate,
  withText,
  className,
  format = 'DDD',
}: LastUpdateInfoProps): ReactElement => {
  const { i18n, t } = useTranslation('common')
  return (
    <StyledTypography variant='label3' className={className} component='p'>
      {withText && t('lastUpdate')} {lastUpdate.setLocale(i18n.language).toFormat(format)}
    </StyledTypography>
  )
}

export default LastUpdateInfo
