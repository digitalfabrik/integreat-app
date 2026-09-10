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
      return t($ => $.regions.notFound)
    case ErrorCodes.LanguageUnavailable:
      return t($ => $.languages.error.notFound.title)
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

  const getFailureProps = (error: Error): { goToPath: string; errorMessage: string } => {
    if (error instanceof NotFoundError && error.region !== undefined && error.language !== undefined) {
      const { region, language } = error
      const params = { regionCode: region, languageCode: language }

      switch (error.type) {
        case 'category':
        case 'imprint':
        case 'route':
          return {
            goToPath: regionContentPath(params),
            errorMessage: t($ => $.error.pageNotFound),
          }
        case 'event':
          return {
            goToPath: pathnameFromRouteInformation({ route: EVENTS_ROUTE, ...params }),
            errorMessage: t($ => $.events.error.notFound),
          }
        case 'news':
          return {
            goToPath: pathnameFromRouteInformation({ route: NEWS_ROUTE, ...params }),
            errorMessage: t($ => $.news.error.notFound),
          }
        case 'place':
          return {
            goToPath: pathnameFromRouteInformation({ route: PLACES_ROUTE, ...params }),
            errorMessage: t($ => $.places.error.notFound),
          }
        case 'region':
          return {
            goToPath: pathnameFromRouteInformation({ route: REGIONS_ROUTE, ...params }),
            errorMessage: t($ => $.regions.notFound),
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
