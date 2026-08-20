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

export const getErrorMessage = (errorCode: ErrorCode, t: TFunction<['error']>): string => {
  switch (errorCode) {
    case ErrorCodes.RegionUnavailable:
      return t($ => $.notFound.region)
    case ErrorCodes.LanguageUnavailable:
      return t($ => $.notFound.language)
    default:
      return t($ => $[errorCode])
  }
}

type FailureSwitcherProps = {
  error: Error
}

const FailureSwitcher = ({ error }: FailureSwitcherProps): ReactElement => {
  const { t } = useTranslation(['error'])

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
            goToMessage: t($ => $.goTo.categories),
            errorMessage: t($ => $.notFound.category),
          }
        case 'event':
          return {
            goToPath: pathnameFromRouteInformation({ route: EVENTS_ROUTE, ...params }),
            goToMessage: t($ => $.goTo.events),
            errorMessage: t($ => $.notFound.event),
          }
        case 'news':
          return {
            goToPath: pathnameFromRouteInformation({ route: NEWS_ROUTE, ...params }),
            goToMessage: t($ => $.goTo.news),
            errorMessage: t($ => $.notFound.news),
          }
        case 'place':
          return {
            goToPath: pathnameFromRouteInformation({ route: PLACES_ROUTE, ...params }),
            goToMessage: t($ => $.goTo.places),
            errorMessage: t($ => $.notFound.place),
          }
        case 'region':
          return {
            goToPath: pathnameFromRouteInformation({ route: REGIONS_ROUTE, ...params }),
            errorMessage: t($ => $.notFound.region),
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
