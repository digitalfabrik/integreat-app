import React, { ReactElement } from 'react'

import { PageModel } from 'api-client'
import { ThemeType } from 'build-configs'

import Page from '../components/Page'

type PropsType = {
  navigateToLink: (url: string, language: string, shareUrl: string) => void
  disclaimer: PageModel
  language: string
  theme: ThemeType
  resourceCacheUrl: string
}

const Disclaimer = ({ disclaimer, theme, language, resourceCacheUrl, navigateToLink }: PropsType): ReactElement => {
  const { title, content, lastUpdate } = disclaimer
  return (
    <Page
      title={title}
      content={content}
      theme={theme}
      navigateToLink={navigateToLink}
      files={{}}
      language={language}
      resourceCacheUrl={resourceCacheUrl}
      lastUpdate={lastUpdate}
    />
  )
}

export default Disclaimer
