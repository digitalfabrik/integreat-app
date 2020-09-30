// @flow

import Page from '../../modules/common/components/Page'
import { PageModel } from '@integreat-app/integreat-api-client'
import type { ThemeType } from '../../modules/theme/constants'
import React from 'react'
import type { NavigationScreenProp } from 'react-navigation'

type PropsType = {|
  disclaimer: PageModel,
  city: string,
  language: string,
  theme: ThemeType,
  navigation: NavigationScreenProp<*>
|}

class Disclaimer extends React.Component<PropsType> {
  render () {
    const { disclaimer, theme, navigation, language } = this.props
    const { title, content, lastUpdate } = disclaimer

    return <Page title={title}
                 content={content}
                 theme={theme}
                 navigation={navigation}
                 files={{}}
                 language={language}
                 resourceCacheUrl='http://localhost:8080'
                 lastUpdate={lastUpdate} />
  }
}

export default Disclaimer
