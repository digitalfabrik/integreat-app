import React, { ReactElement } from 'react'

import { PageModel } from 'api-client'

import Page from '../components/Page'

type DisclaimerProps = {
  disclaimer: PageModel
  language: string
  resourceCacheUrl: string
}

const Disclaimer = ({ disclaimer, language, resourceCacheUrl }: DisclaimerProps): ReactElement => {
  const { title, content, lastUpdate } = disclaimer
  return (
    <Page
      title={title}
      content={content}
      files={{}}
      language={language}
      resourceCacheUrl={resourceCacheUrl}
      lastUpdate={lastUpdate}
    />
  )
}

export default Disclaimer
