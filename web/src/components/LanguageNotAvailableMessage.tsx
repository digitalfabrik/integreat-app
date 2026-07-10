import React, { ReactElement } from 'react'
import { Trans } from 'react-i18next'

import { RATING_NEGATIVE, toQueryParams } from 'shared'

import Link from './base/Link'

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
      <Link to={`?${toQueryParams({ feedback: RATING_NEGATIVE })}`} onClick={close} highlighted>
        by react-i18next
      </Link>
    ) : (
      <span>by react-i18next</span>
    )}
  </Trans>
)

export default LanguageNotAvailableMessage
