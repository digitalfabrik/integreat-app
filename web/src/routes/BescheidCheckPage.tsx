import React, { ReactElement } from 'react'
import { useSearchParams } from 'react-router'

import {
  bescheidCheckName,
  parseQueryParams,
  pathnameFromRouteInformation,
  regionContentPath,
  REGIONS_ROUTE,
} from 'shared'

import BackButton from '../components/BackButton'
import Footer from '../components/Footer'
import GeneralHeader from '../components/GeneralHeader'
import Layout from '../components/Layout'
import H1 from '../components/base/H1'

type BescheidCheckPageProps = {
  languageCode: string
}

const BescheidCheckPage = ({ languageCode }: BescheidCheckPageProps): ReactElement => {
  const [searchParams] = useSearchParams()
  const { region: regionCode } = parseQueryParams(searchParams)

  const fallbackBackTo = regionCode
    ? regionContentPath({ regionCode, languageCode })
    : pathnameFromRouteInformation({ route: REGIONS_ROUTE, languageCode })

  return (
    <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<Footer />}>
      <BackButton desktop fallback={fallbackBackTo} />
      <H1>{bescheidCheckName}</H1>
    </Layout>
  )
}

export default BescheidCheckPage
