import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import Caption from '../components/Caption'
import Footer from '../components/Footer'
import GeneralHeader from '../components/GeneralHeader'
import Helmet from '../components/Helmet'
import Layout from '../components/Layout'
import buildConfig from '../constants/buildConfig'

type MainDisclaimerPageProps = { languageCode: string }

const MainDisclaimerPage = ({ languageCode }: MainDisclaimerPageProps): ReactElement => {
  const { t } = useTranslation('mainDisclaimer')

  const pageTitle = t('pageTitle', { appName: buildConfig().appName })

  return (
    <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<Footer />}>
      <Helmet pageTitle={pageTitle} />
      <div>
        <Caption title='Impressum und Datenschutz' />
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
