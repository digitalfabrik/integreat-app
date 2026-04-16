import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import Footer from '../components/Footer'
import GeneralHeader from '../components/GeneralHeader'
import Helmet from '../components/Helmet'
import Layout from '../components/Layout'
import H1 from '../components/base/H1'
import buildConfig from '../constants/buildConfig'

type MainImprintPageProps = { languageCode: string }

const MainImprintPage = ({ languageCode }: MainImprintPageProps): ReactElement => {
  const { t } = useTranslation('mainImprint')

  const pageTitle = t('pageTitle', { appName: buildConfig().appName })

  return (
    <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<Footer />}>
      <Helmet pageTitle={pageTitle} />
      <div dir='ltr'>
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

export default MainImprintPage
