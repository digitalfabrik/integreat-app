// @flow

import Page from '../../modules/common/components/Page'
import { PageModel } from 'api-client'
import type { ThemeType } from '../../modules/theme/constants'
import React from 'react'
import type {
  DisclaimerRouteType,
  NavigationPropType,
  RoutePropType
} from '../../modules/app/components/NavigationTypes'

type PropsType = {|
  route: RoutePropType<DisclaimerRouteType>,
  navigation: NavigationPropType<DisclaimerRouteType>,
  disclaimer: PageModel,
  city: string,
  language: string,
  theme: ThemeType,
  resourceCacheUrl: string
|}

class Disclaimer extends React.Component<PropsType> {
  render () {
    const { disclaimer, theme, navigation, language, resourceCacheUrl } = this.props
    const { title, content, lastUpdate } = disclaimer

    return <Page title={title}
                 content={content}
                 theme={theme}
                 navigation={navigation}
                 files={{}}
                 language={language}
                 resourceCacheUrl={resourceCacheUrl}
                 lastUpdate={lastUpdate} />
  }
}

export default Disclaimer
