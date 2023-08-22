import StaticServer from '@dr.pogodin/react-native-static-server'
import React, { createContext, ReactElement, ReactNode, useEffect, useState } from 'react'

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
  const [resourceCacheUrl, setResourceCacheUrl] = useState<string>('')

  useEffect(() => {
    staticServer.start().then(setResourceCacheUrl).catch(reportError)

    return () => {
      setResourceCacheUrl('')
      staticServer.stop()
    }
  }, [])

  if (resourceCacheUrl.length === 0) {
    return null
  }

  return <StaticServerContext.Provider value={resourceCacheUrl}>{children}</StaticServerContext.Provider>
}

export default StaticServerProvider
