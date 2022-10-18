import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { RefreshControl } from 'react-native'

import { ErrorCode, ReturnType } from 'api-client'

import Failure from '../components/Failure'
import Layout from '../components/Layout'
import LayoutedScrollView from '../components/LayoutedScrollView'
import ProgressSpinner from '../components/ProgressSpinner'
import { LOADING_TIMEOUT } from '../hocs/withPayloadProvider'

type LoadingErrorHandlerProps<T> = ReturnType<T> & {
  children?: ReactNode
  scrollView?: boolean
}

const LoadingErrorHandler = <T,>({
  children,
  scrollView = false,
  loading,
  refresh,
  error,
}: LoadingErrorHandlerProps<T>): ReactElement => {
  const [timeoutExpired, setTimeoutExpired] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutExpired(true)
    }, LOADING_TIMEOUT)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    // Prevent jumpy behaviour by showing nothing until the timeout finishes
    if (timeoutExpired) {
      return <Layout />
    }
    return (
      <LayoutedScrollView refreshControl={<RefreshControl refreshing={!children} />}>
        {children ?? <ProgressSpinner progress={0} />}
      </LayoutedScrollView>
    )
  }

  if (error) {
    return (
      <LayoutedScrollView refreshControl={<RefreshControl onRefresh={refresh} refreshing={false} />}>
        {/* TODO error code */}
        <Failure tryAgain={refresh} code={ErrorCode.UnknownError} />
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
