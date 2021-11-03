import React, { ReactElement } from 'react'

import { PageModel } from 'api-client'
import { ThemeType } from 'build-configs'

import Page from '../components/Page'

type PropsType = {
  disclaimer: PageModel
  language: string
  theme: ThemeType
  resourceCacheUrl: string
}

const Disclaimer = ({ disclaimer, theme, language, resourceCacheUrl }: PropsType): ReactElement => {
  const { title, content, lastUpdate } = disclaimer
  return (
    <Page
      title={title}
      content={content}
      theme={theme}
      files={{}}
      language={language}
      resourceCacheUrl={resourceCacheUrl}
      lastUpdate={lastUpdate}
    />
  )
}

export default Disclaimer
