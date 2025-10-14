import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import Footer from '../components/Footer'
import GeneralHeader from '../components/GeneralHeader'
import Helmet from '../components/Helmet'
import Layout from '../components/Layout'
import H1 from '../components/base/H1'
import buildConfig from '../constants/buildConfig'

type MainDisclaimerPageProps = { languageCode: string }

const MainDisclaimerPage = ({ languageCode }: MainDisclaimerPageProps): ReactElement => {
  const { t } = useTranslation('mainDisclaimer')

  const pageTitle = t('pageTitle', { appName: buildConfig().appName })

  return (
    <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<Footer />}>
      <Helmet pageTitle={pageTitle} />
      <div>
        <H1>Impressum und Datenschutz</H1>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: buildConfig().mainImprint,
          }}
        />
      </div>
    </Layout>
  )
}

export default MainDisclaimerPage
