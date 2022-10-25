import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import Caption from '../components/Caption'
import GeneralFooter from '../components/GeneralFooter'
import GeneralHeader from '../components/GeneralHeader'
import Helmet from '../components/Helmet'
import Layout from '../components/Layout'
import buildConfig from '../constants/buildConfig'
import useWindowDimensions from '../hooks/useWindowDimensions'

type MainDisclaimerPageProps = { languageCode: string }

const MainDisclaimerPage = ({ languageCode }: MainDisclaimerPageProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation('mainDisclaimer')

  const pageTitle = t('pageTitle', { appName: buildConfig().appName })

  return (
    <Layout
      header={<GeneralHeader languageCode={languageCode} viewportSmall={viewportSmall} />}
      footer={<GeneralFooter language={languageCode} />}>
      <Helmet pageTitle={pageTitle} />
      <div>
        <Caption title='Impressum und Datenschutz' />
        <div
          dangerouslySetInnerHTML={{
            __html: buildConfig().mainImprint,
          }}
        />
      </div>
    </Layout>
  )
}

export default MainDisclaimerPage
