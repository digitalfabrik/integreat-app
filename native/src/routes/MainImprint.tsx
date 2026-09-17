import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import LayoutedScrollView from '../components/LayoutedScrollView'
import Page from '../components/Page'
import Text from '../components/base/Text'
import buildConfig from '../constants/buildConfig'
import useSetRouteTitle from '../hooks/useSetRouteTitle'

const MainImprint = (): ReactElement => {
  const { i18n, t } = useTranslation()

  useSetRouteTitle(t($ => $.about.imprint))

  return (
    <LayoutedScrollView>
      <Text variant='h1' style={{ margin: 16 }}>
        Impressum und Datenschutz
      </Text>
      <Page content={buildConfig().mainImprint} language={i18n.language} />
    </LayoutedScrollView>
  )
}

export default MainImprint
