import React, { ReactElement, useEffect } from 'react'

import {
  regionContentPath,
  EVENTS_ROUTE,
  NEWS_ROUTE,
  pathnameFromRouteInformation,
  POIS_ROUTE,
  LANDING_ROUTE,
  LOCAL_NEWS_TYPE,
  TU_NEWS_TYPE,
} from 'shared'
import { fromError, NotFoundError } from 'shared/api'

import { reportError } from '../utils/sentry'
import Failure from './Failure'

type FailureSwitcherProps = {
  error: Error
}

const FailureSwitcher = ({ error }: FailureSwitcherProps): ReactElement => {
  useEffect(() => {
    reportError(error)
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
            goToMessage: 'goTo.categories',
            errorMessage: 'notFound.category',
          }
        case 'event':
          return {
            goToPath: pathnameFromRouteInformation({ route: EVENTS_ROUTE, ...params }),
            goToMessage: 'goTo.events',
            errorMessage: 'notFound.event',
          }
        case LOCAL_NEWS_TYPE:
        case TU_NEWS_TYPE:
          return {
            goToPath: pathnameFromRouteInformation({ route: NEWS_ROUTE, newsType: error.type, ...params }),
            goToMessage: 'goTo.news',
            errorMessage: 'notFound.news',
          }
        case 'poi':
          return {
            goToPath: pathnameFromRouteInformation({ route: POIS_ROUTE, ...params }),
            goToMessage: 'goTo.pois',
            errorMessage: 'notFound.poi',
          }
        case 'region':
          return {
            goToPath: pathnameFromRouteInformation({ route: LANDING_ROUTE, ...params }),
            errorMessage: 'notFound.region',
          }
      }
    }
    return {
      goToPath: '/',
      errorMessage: fromError(error),
    }
  }

  return <Failure {...getFailureProps(error)} />
}

export default FailureSwitcher
