import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { CityModel } from 'api-client'

import CitySelector from './CitySelector'
import Heading from './Heading'
import ScrollingSearchBox from './ScrollingSearchBox'

const Container = styled.div`
  padding-top: 22px;
`

type PropsType = {
  cities: Array<CityModel>
  language: string
}

const FilterableCitySelector = ({ cities, language }: PropsType): ReactElement => {
  const [filterText, setFilterText] = useState<string>('')
  const [stickyTop, setStickyTop] = useState<number>(0)
  const { t } = useTranslation('landing')

  return (
    <Container>
      <Heading />
      <ScrollingSearchBox
        filterText={filterText}
        onFilterTextChange={setFilterText}
        placeholderText={t('searchCity')}
        spaceSearch={false}
        onStickyTopChanged={setStickyTop}>
        <CitySelector stickyTop={stickyTop} cities={cities} filterText={filterText} language={language} />
      </ScrollingSearchBox>
    </Container>
  )
}

export default FilterableCitySelector
