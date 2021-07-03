import React, { ReactElement } from 'react'
import Caption from '../components/Caption'
import buildConfig from '../constants/buildConfig'
import Layout from '../components/Layout'
import GeneralFooter from '../components/GeneralFooter'
import GeneralHeader from '../components/GeneralHeader'
import useWindowDimensions from '../hooks/useWindowDimensions'
import Helmet from '../components/Helmet'
import { useTranslation } from 'react-i18next'

type PropsType = { languageCode: string }

const MainDisclaimerPage = ({ languageCode }: PropsType): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const { t } = useTranslation()

  const pageTitle = t('app:pageTitles.mainDisclaimer', { appName: buildConfig().appName })

  return (
    <Layout
      header={<GeneralHeader languageCode={languageCode} viewportSmall={viewportSmall} />}
      footer={<GeneralFooter language={languageCode} />}>
      <Helmet pageTitle={pageTitle} />
      <div>
        <Caption title='Impressum und Datenschutz' />
        <div
          dangerouslySetInnerHTML={{
            __html: buildConfig().mainImprint
          }}
        />
      </div>
    </Layout>
  )
}

export default MainDisclaimerPage
