import StaticServer from '@dr.pogodin/react-native-static-server'
import React, { createContext, ReactElement, ReactNode, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { RESOURCE_CACHE_DIR_PATH } from '../utils/DatabaseConnector'
import { reportError } from '../utils/sentry'

type StaticServerProps = {
  children: ReactNode
}

const SERVER_PATH = RESOURCE_CACHE_DIR_PATH
const SERVER_PORT = 8080

const staticServer = new StaticServer(SERVER_PORT, SERVER_PATH, {
  localOnly: true,
})

export const StaticServerContext = createContext('')

const StaticServerProvider = ({ children }: StaticServerProps): ReactElement | null => {
  const [resourceCacheUrl, setResourceCacheUrl] = useState<string | null>(null)
  const dispatch = useDispatch()

  useEffect(() => {
    staticServer.start().then(setResourceCacheUrl).catch(reportError)

    return () => {
      staticServer.stop()
    }
  }, [])

  useEffect(() => {
    dispatch({
      type: 'SET_RESOURCE_CACHE_URL',
      params: {
        url: resourceCacheUrl,
      },
    })
  }, [dispatch, resourceCacheUrl])

  if (resourceCacheUrl === null) {
    return null
  }

  return <StaticServerContext.Provider value={resourceCacheUrl}>{children}</StaticServerContext.Provider>
}

export default StaticServerProvider
