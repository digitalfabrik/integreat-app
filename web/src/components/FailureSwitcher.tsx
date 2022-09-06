import React, { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import {
  cityContentPath,
  EVENTS_ROUTE,
  fromError,
  NEWS_ROUTE,
  NotFoundError,
  OFFERS_ROUTE,
  pathnameFromRouteInformation,
  POIS_ROUTE,
} from 'api-client'
import { LANDING_ROUTE, LOCAL_NEWS_TYPE, TU_NEWS_TYPE } from 'api-client/src/routes'

import { reportError } from '../utils/sentry'
import Failure from './Failure'
import Helmet from './Helmet'

type PropsType = {
  error: Error
}

const FailureSwitcher = ({ error }: PropsType): ReactElement => {
  const { t } = useTranslation('error')

  useEffect(() => {
    reportError(error)
  }, [error])

  const getFailureProps = (error: Error): { goToPath?: string; goToMessage?: string; errorMessage: string } => {
    if (error instanceof NotFoundError && error.city !== undefined && error.language !== undefined) {
      const { city, language } = error
      const params = { cityCode: city, languageCode: language }

      switch (error.type) {
        case 'category':
        case 'disclaimer':
        case 'route':
          return {
            goToPath: cityContentPath(params),
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
          return {
            goToPath: pathnameFromRouteInformation({ route: NEWS_ROUTE, newsType: LOCAL_NEWS_TYPE, ...params }),
            goToMessage: 'goTo.localNews',
            errorMessage: 'notFound.localNews',
          }
        case TU_NEWS_TYPE:
          return {
            goToPath: pathnameFromRouteInformation({ route: NEWS_ROUTE, newsType: TU_NEWS_TYPE, ...params }),
            goToMessage: 'goTo.tunews',
            errorMessage: 'notFound.tunews',
          }
        case 'offer':
          return {
            goToPath: pathnameFromRouteInformation({ route: OFFERS_ROUTE, ...params }),
            goToMessage: 'goTo.offers',
            errorMessage: 'notFound.offer',
          }
        case 'poi':
          return {
            goToPath: pathnameFromRouteInformation({ route: POIS_ROUTE, ...params }),
            goToMessage: 'goTo.pois',
            errorMessage: 'notFound.poi',
          }
        case 'city':
          return {
            goToPath: pathnameFromRouteInformation({ route: LANDING_ROUTE, ...params }),
            errorMessage: 'notFound.city',
          }
      }
    }
    return {
      goToPath: '/',
      errorMessage: fromError(error),
    }
  }

  return (
    <>
      <Helmet pageTitle={error instanceof NotFoundError ? t('notFound.pageTitle') : t('pageTitle')} />
      <Failure {...getFailureProps(error)} t={t} />
    </>
  )
}

export default FailureSwitcher
