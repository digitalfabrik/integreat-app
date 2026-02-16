import React, { ReactElement, useEffect } from 'react'

import { RedirectRouteType } from 'shared'

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
    navigateToDeepLink(url)
  }, [url, navigateToDeepLink])

  return <Layout />
}

export default RedirectContainer
