import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { RefreshControl } from 'react-native'

import { REGIONS_ROUTE } from 'shared'
import { ErrorCode, ErrorCodes, fromError, LanguageModel } from 'shared/api'

import Failure from '../components/Failure'
import LanguageNotAvailablePage from '../components/LanguageNotAvailablePage'
import Layout from '../components/Layout'
import LayoutedScrollView from '../components/LayoutedScrollView'
import ProgressSpinner from '../components/ProgressSpinner'
import { AppContext } from '../contexts/AppContext'

// A waiting time of >=1s feels like an interruption
const LOADING_TIMEOUT = 800

type LoadingErrorHandlerProps = {
  children?: ReactElement | null
  error: Error | ErrorCode | null
  loading: boolean
  refresh: () => void
  availableLanguages?: LanguageModel[]
  scrollView?: boolean
}

const LoadingErrorHandler = ({
  children,
  loading,
  refresh,
  error,
  availableLanguages,
  scrollView = false,
}: LoadingErrorHandlerProps): ReactElement => {
  const { languageCode } = useContext(AppContext)
  const [timeoutExpired, setTimeoutExpired] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutExpired(true)
    }, LOADING_TIMEOUT)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    // Prevent jumpy behavior by showing nothing until the timeout finishes
    if (!timeoutExpired) {
      return <Layout />
    }
    if (scrollView) {
      return (
        <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={!!children} />}>
          {children ?? <ProgressSpinner />}
        </LayoutedScrollView>
      )
    }
    return <Layout>{children ?? <ProgressSpinner />}</Layout>
  }

  if (error === ErrorCodes.LanguageUnavailable) {
    return <LanguageNotAvailablePage availableLanguages={availableLanguages} />
  }

  if (error !== null) {
    const errorCode = error instanceof Error ? fromError(error) : error
    const goTo = [ErrorCodes.RegionUnavailable, ErrorCodes.ForbiddenError].includes(errorCode)
      ? { route: REGIONS_ROUTE, languageCode }
      : undefined

    return (
      <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={false} />}>
        <Failure retry={refresh} code={errorCode} goTo={goTo} />
      </LayoutedScrollView>
    )
  }

  if (scrollView) {
    return (
      <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={false} />}>
        {children}
      </LayoutedScrollView>
    )
  }

  return <Layout>{children}</Layout>
}

export default LoadingErrorHandler
