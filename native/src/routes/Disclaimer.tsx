import React, { ReactNode } from 'react'

import { PageModel } from 'api-client'
import { ThemeType } from 'build-configs'

import Page from '../components/Page'

type PropsType = {
  navigateToLink: (url: string, language: string, shareUrl: string) => Promise<void>
  disclaimer: PageModel
  language: string
  theme: ThemeType
  resourceCacheUrl: string
}

class Disclaimer extends React.Component<PropsType> {
  render(): ReactNode {
    const { disclaimer, theme, language, resourceCacheUrl } = this.props
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
}

export default Disclaimer
