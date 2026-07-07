import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'
import { Trans } from 'react-i18next'

import { RATING_NEGATIVE, toQueryParams } from 'shared'

import Link from './base/Link'

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'underline',
}))

type LanguageNotAvailableMessageProps = {
  feedbackAvailable?: boolean
  close: () => void
}

const LanguageNotAvailableMessage = ({
  feedbackAvailable = false,
  close,
}: LanguageNotAvailableMessageProps): ReactElement => (
  <Trans i18nKey='layout:languageNotAvailableMessage'>
    This gets replaced
    {feedbackAvailable ? (
      <StyledLink to={`?${toQueryParams({ feedback: RATING_NEGATIVE })}`} onClick={close}>
        by react-i18next
      </StyledLink>
    ) : (
      <span>by react-i18next</span>
    )}
  </Trans>
)

export default LanguageNotAvailableMessage
