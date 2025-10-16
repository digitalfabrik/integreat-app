import React, { ReactElement } from 'react'
import { useParams } from 'react-router'

import { CityModel, NotFoundError } from 'shared/api'

import CityContentSwitcher from './CityContentSwitcher'
import FailureSwitcher from './components/FailureSwitcher'
import GeneralFooter from './components/GeneralFooter'
import GeneralHeader from './components/GeneralHeader'
import Layout from './components/Layout'

type FixedCityContentSwitcherProps = {
  languageCode: string
  fixedCity: string
}

export type CityRouteProps = {
  city: CityModel | null
  pathname: string
  cityCode: string
  languageCode: string
}

const FixedCityContentSwitcher = ({ languageCode, fixedCity }: FixedCityContentSwitcherProps): ReactElement => {
  const { cityCode } = useParams()
  if (cityCode !== fixedCity) {
    const notFoundError = new NotFoundError({ type: 'route', id: fixedCity, city: fixedCity, language: languageCode })

    return (
      <Layout header={<GeneralHeader languageCode={languageCode} />} footer={<GeneralFooter language={languageCode} />}>
        <FailureSwitcher error={notFoundError} />
      </Layout>
    )
  }
  return <CityContentSwitcher languageCode={languageCode} />
}

export default FixedCityContentSwitcher
