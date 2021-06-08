import React, { ReactElement } from 'react'
import { CityModel } from 'api-client'
import { RouteComponentProps } from 'react-router-dom'
import FilterableCitySelector from '../components/FilterableCitySelector'
import Layout from '../components/Layout'
import GeneralFooter from '../components/GeneralFooter'

type PropsType = {
  cities: Array<CityModel>
} & RouteComponentProps<{ languageCode: string }>

const LandingPage = ({ cities, match }: PropsType): ReactElement => {
  const { languageCode } = match.params

  return (
    <Layout footer={<GeneralFooter language={languageCode} />}>
      <FilterableCitySelector cities={cities} language={languageCode} />
    </Layout>
  )
}

export default LandingPage
