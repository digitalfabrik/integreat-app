import React, { ReactElement, useEffect } from 'react'

import { RedirectRouteType } from 'shared'

import { NAVIGATION_INITIALIZATION_DELAY } from '../constants'
import { RouteProps } from '../constants/NavigationTypes'
import useNavigateToDeepLink from '../hooks/useNavigateToDeepLink'
import Layout from './Layout'

type RedirectContainerProps = {
  route: RouteProps<RedirectRouteType>
}

const RedirectContainer = ({ route }: RedirectContainerProps): ReactElement => {
  const navigateToDeepLink = useNavigateToDeepLink({ redirect: true })
  const { url } = route.params

  useEffect(() => {
    // Add a small delay to ensure navigation is fully initialized when app is launched from closed state
    const timeout = setTimeout(() => {
      navigateToDeepLink(url)
    }, NAVIGATION_INITIALIZATION_DELAY)
    return () => clearTimeout(timeout)
  }, [url, navigateToDeepLink])

  return <Layout />
}

export default RedirectContainer
