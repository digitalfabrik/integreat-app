import React, { ReactElement } from 'react'
import { useParams } from 'react-router'

import { RegionModel, NotFoundError } from 'shared/api'

import RegionContentNavigator from './RegionContentNavigator'
import FailureSwitcherWithHelmet from './components/FailureSwitcherWithHelmet'
import Footer from './components/Footer'
import GeneralHeader from './components/GeneralHeader'
import Layout from './components/Layout'

type FixedRegionContentNavigatorProps = {
  languageCode: string
  fixedRegion: string
}

export type RegionRouteProps = {
  region: RegionModel | null
  pathname: string
  regionCode: string
  languageCode: string
}

const FixedRegionContentNavigator = ({ languageCode, fixedRegion }: FixedRegionContentNavigatorProps): ReactElement => {
  const { regionCode } = useParams()
  if (regionCode !== fixedRegion) {
    const notFoundError = new NotFoundError({
      type: 'route',
      id: fixedRegion,
      region: fixedRegion,
      language: languageCode,
    })

    return (
      <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<Footer />}>
        <FailureSwitcherWithHelmet error={notFoundError} />
      </Layout>
    )
  }
  return <RegionContentNavigator languageCode={languageCode} />
}

export default FixedRegionContentNavigator
