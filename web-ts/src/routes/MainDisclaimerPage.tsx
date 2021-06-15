import React, { ReactElement } from 'react'
import Caption from '../components/Caption'
import buildConfig from '../constants/buildConfig'
import Layout from '../components/Layout'
import GeneralFooter from '../components/GeneralFooter'
import GeneralHeader from '../components/GeneralHeader'
import useWindowDimensions from '../hooks/useWindowDimensions'

type PropsType = { languageCode: string }

const MainDisclaimerPage = ({ languageCode }: PropsType): ReactElement => {
  const { viewportSmall } = useWindowDimensions()

  return (
    <Layout
      header={<GeneralHeader languageCode={languageCode} viewportSmall={viewportSmall} />}
      footer={<GeneralFooter language={languageCode} />}>
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
