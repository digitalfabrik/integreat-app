import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { RefreshControl } from 'react-native'

import { ErrorCode } from 'api-client'

import Failure from '../components/Failure'
import Layout from '../components/Layout'
import LayoutedScrollView from '../components/LayoutedScrollView'
import ProgressSpinner from '../components/ProgressSpinner'
import { LOADING_TIMEOUT } from '../hocs/withPayloadProvider'

type LoadingErrorHandlerProps = {
  children?: ReactNode
  error: Error | null
  loading: boolean
  refresh: () => void
}

const LoadingErrorHandler = ({ children, loading, refresh, error }: LoadingErrorHandlerProps): ReactElement => {
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
    return (
      <Layout>
        <RefreshControl refreshing={!children} />
        {children ?? <ProgressSpinner progress={0} />}
      </Layout>
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

  return <Layout>{children}</Layout>
}

export default LoadingErrorHandler
