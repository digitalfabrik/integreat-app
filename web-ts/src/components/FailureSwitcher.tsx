import React, { ReactElement } from 'react'
import { CATEGORIES_ROUTE, EVENTS_ROUTE, fromError, NotFoundError, OFFERS_ROUTE, POIS_ROUTE } from 'api-client'
import Failure from './Failure'
import { LOCAL_NEWS_TYPE, TU_NEWS_TYPE } from 'api-client/src/routes'
import { createPath } from '../routes'
import { useTranslation } from 'react-i18next'

type PropsType = {
  error: Error
}

const FailureSwitcher = ({ error }: PropsType): ReactElement => {
  const { t } = useTranslation('error')

  const getFailureProps = (error: Error): { goToPath?: string; goToMessage?: string; errorMessage: string } => {
    if (error instanceof NotFoundError) {
      const { city, language } = error
      const params = { cityCode: city, languageCode: language }

      switch (error.type) {
        case 'category':
          return {
            goToPath: createPath(CATEGORIES_ROUTE, params),
            goToMessage: 'goTo.categories',
            errorMessage: 'notFound.category'
          }
        case 'event':
          return {
            goToPath: createPath(EVENTS_ROUTE, params),
            goToMessage: 'goTo.events',
            errorMessage: 'notFound.event'
          }
        case LOCAL_NEWS_TYPE:
          return {
            goToPath: createPath(LOCAL_NEWS_TYPE, params),
            goToMessage: 'goTo.localNews',
            errorMessage: 'notFound.localNews'
          }
        case TU_NEWS_TYPE:
          return {
            goToPath: createPath(TU_NEWS_TYPE, params),
            goToMessage: 'goTo.tunews',
            errorMessage: 'notFound.tunews'
          }
        case 'offer':
          return {
            goToPath: createPath(OFFERS_ROUTE, params),
            goToMessage: 'goTo.offers',
            errorMessage: 'notFound.offer'
          }
        case 'poi':
          return {
            goToPath: createPath(POIS_ROUTE, params),
            goToMessage: 'goTo.pois',
            errorMessage: 'notFound.poi'
          }
      }
    }
    return { errorMessage: fromError(error) }
  }

  return (
    <Failure {...getFailureProps(error)} t={t} />
  )
}

export default FailureSwitcher
