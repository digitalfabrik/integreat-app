import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { RefreshControl } from 'react-native'

import { ErrorCode, fromError, LanguageModel } from 'api-client'

import Failure from '../components/Failure'
import LanguageNotAvailablePage from '../components/LanguageNotAvailablePage'
import Layout from '../components/Layout'
import LayoutedScrollView from '../components/LayoutedScrollView'
import ProgressSpinner from '../components/ProgressSpinner'

// A waiting time of >=1s feels like an interruption
const LOADING_TIMEOUT = 800

type LoadingErrorHandlerProps = {
  children?: ReactNode
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
  const [timeoutExpired, setTimeoutExpired] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutExpired(true)
    }, LOADING_TIMEOUT)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    // Prevent jumpy behaviour by showing nothing until the timeout finishes
    if (!timeoutExpired) {
      return <Layout />
    }
    if (scrollView) {
      return (
        <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing />}>
          {children ?? <ProgressSpinner progress={0} />}
        </LayoutedScrollView>
      )
    }
    return <Layout>{children ?? <ProgressSpinner progress={0} />}</Layout>
  }

  if (error === ErrorCode.LanguageUnavailable) {
    return <LanguageNotAvailablePage availableLanguages={availableLanguages} />
  }

  if (error) {
    return (
      <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={false} />}>
        <Failure tryAgain={refresh} code={error instanceof Error ? fromError(error) : error} />
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
