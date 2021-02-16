// @flow

import Page from '../../modules/common/components/Page'
import { PageModel } from 'api-client'
import type { ThemeType } from 'build-configs/ThemeType'
import React from 'react'

type PropsType = {|
  navigateToLink: (url: string, language: string, shareUrl: string) => void,
  disclaimer: PageModel,
  language: string,
  theme: ThemeType,
  resourceCacheUrl: string
|}

class Disclaimer extends React.Component<PropsType> {
  render () {
    const { disclaimer, theme, language, resourceCacheUrl, navigateToLink } = this.props
    const { title, content, lastUpdate } = disclaimer

    return <Page title={title}
                 content={content}
                 theme={theme}
                 navigateToLink={navigateToLink}
                 files={{}}
                 language={language}
                 resourceCacheUrl={resourceCacheUrl}
                 lastUpdate={lastUpdate} />
  }
}

export default Disclaimer
