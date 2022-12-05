import React, { ReactElement } from 'react'
import { Helmet } from 'react-helmet'
import { WebSite, WithContext } from 'schema-dts'

import buildConfig from '../constants/buildConfig'

const JsonLdBreadcrumbs = (): ReactElement => {
  const config = buildConfig()

  const jsonLd: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.hostName,
    url: window.location.origin,
    version: __VERSION_NAME__,
  }

  return (
    <Helmet>
      <script type='application/ld+json'>{JSON.stringify(jsonLd)}</script>
    </Helmet>
  )
}

export default JsonLdBreadcrumbs
