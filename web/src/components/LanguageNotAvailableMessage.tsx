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
}: LanguageNotAvailableMessageProps): ReactElement => {
  const to = `?${toQueryParams({ feedback: RATING_NEGATIVE })}`
  return (
    <Trans
      ns='languages'
      i18nKey={$ => $.languages.error.notFound.description}
      components={{ Link: feedbackAvailable ? <Link to={to} onClick={close} highlighted /> : <span /> }}
    />
  )
}

export default LanguageNotAvailableMessage
