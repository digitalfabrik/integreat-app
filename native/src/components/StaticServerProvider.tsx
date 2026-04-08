import StaticServer from '@dr.pogodin/react-native-static-server'
import React, { createContext, ReactElement, ReactNode, useEffect, useState } from 'react'

import { RESOURCE_CACHE_DIR_PATH } from '../utils/DatabaseConnector'
import { reportError } from '../utils/sentry'

type StaticServerProps = {
  children: ReactNode
}

const staticServer = new StaticServer({
  fileDir: RESOURCE_CACHE_DIR_PATH,
})

export const StaticServerContext = createContext('')

const StaticServerProvider = ({ children }: StaticServerProps): ReactElement | null => {
  const [resourceCacheUrl, setResourceCacheUrl] = useState<string | null>(null)

  useEffect(() => {
    staticServer.start().then(setResourceCacheUrl).catch(reportError)

    return () => {
      staticServer.stop()
    }
  }, [])

  if (resourceCacheUrl === null) {
    return null
  }
  return <StaticServerContext.Provider value={resourceCacheUrl}>{children}</StaticServerContext.Provider>
}

export default StaticServerProvider
