import React, { ReactElement } from 'react'
import { useParams } from 'react-router'

import { CityModel, NotFoundError } from 'shared/api'

import RegionContentNavigator from './RegionContentNavigator'
import FailureSwitcherWithHelmet from './components/FailureSwitcherWithHelmet'
import Footer from './components/Footer'
import GeneralHeader from './components/GeneralHeader'
import Layout from './components/Layout'

type FixedCityContentNavigatorProps = {
  languageCode: string
  fixedCity: string
}

export type CityRouteProps = {
  city: CityModel | null
  pathname: string
  cityCode: string
  languageCode: string
}

const FixedRegionContentNavigator = ({ languageCode, fixedCity }: FixedCityContentNavigatorProps): ReactElement => {
  const { cityCode } = useParams()
  if (cityCode !== fixedCity) {
    const notFoundError = new NotFoundError({ type: 'route', id: fixedCity, city: fixedCity, language: languageCode })

    return (
      <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<Footer />}>
        <FailureSwitcherWithHelmet error={notFoundError} />
      </Layout>
    )
  }
  return <RegionContentNavigator languageCode={languageCode} />
}

export default FixedRegionContentNavigator
