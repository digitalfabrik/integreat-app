import { TFunction } from 'i18next'
import React, { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import {
  regionContentPath,
  EVENTS_ROUTE,
  NEWS_ROUTE,
  pathnameFromRouteInformation,
  PLACES_ROUTE,
  REGIONS_ROUTE,
} from 'shared'
import { ErrorCode, ErrorCodes, fromError, NotFoundError } from 'shared/api'

import { captureError } from '../utils/sentry'
import Failure from './Failure'

export const getErrorMessage = (errorCode: ErrorCode, t: TFunction): string => {
  switch (errorCode) {
    case ErrorCodes.RegionUnavailable:
      return t($ => $.error.notFound.region)
    case ErrorCodes.LanguageUnavailable:
      return t($ => $.error.notFound.language)
    default:
      return t($ => $.error[errorCode])
  }
}

type FailureSwitcherProps = {
  error: Error
}

const FailureSwitcher = ({ error }: FailureSwitcherProps): ReactElement => {
  const { t } = useTranslation()

  useEffect(() => {
    captureError(error)
  }, [error])

  const getFailureProps = (error: Error): { goToPath?: string; goToMessage?: string; errorMessage: string } => {
    if (error instanceof NotFoundError && error.region !== undefined && error.language !== undefined) {
      const { region, language } = error
      const params = { regionCode: region, languageCode: language }

      switch (error.type) {
        case 'category':
        case 'imprint':
        case 'route':
          return {
            goToPath: regionContentPath(params),
            goToMessage: t($ => $.error.goTo.categories),
            errorMessage: t($ => $.error.notFound.category),
          }
        case 'event':
          return {
            goToPath: pathnameFromRouteInformation({ route: EVENTS_ROUTE, ...params }),
            goToMessage: t($ => $.error.goTo.events),
            errorMessage: t($ => $.error.notFound.event),
          }
        case 'news':
          return {
            goToPath: pathnameFromRouteInformation({ route: NEWS_ROUTE, ...params }),
            goToMessage: t($ => $.error.goTo.news),
            errorMessage: t($ => $.error.notFound.news),
          }
        case 'place':
          return {
            goToPath: pathnameFromRouteInformation({ route: PLACES_ROUTE, ...params }),
            goToMessage: t($ => $.error.goTo.places),
            errorMessage: t($ => $.error.notFound.place),
          }
        case 'region':
          return {
            goToPath: pathnameFromRouteInformation({ route: REGIONS_ROUTE, ...params }),
            errorMessage: t($ => $.error.notFound.region),
          }
      }
    }
    return {
      goToPath: '/',
      errorMessage: getErrorMessage(fromError(error), t),
    }
  }

  return <Failure {...getFailureProps(error)} />
}

export default FailureSwitcher
