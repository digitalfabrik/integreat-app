import * as React from 'react'
import { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CityModel } from 'api-client'
import { ThemeType } from 'build-configs'

import FilterableCitySelector from '../components/FilterableCitySelector'
import Heading from '../components/Heading'
import useLocation from '../hooks/useLocation'
import testID from '../testing/testID'

const Wrapper = styled(View)`
  background-color: ${props => props.theme.colors.backgroundColor};
  padding: 20px;
  align-items: center;
  flex-grow: 1;
`

export type PropsType = {
  cities: Array<CityModel>
  language: string
  theme: ThemeType
  navigateToDashboard: (cityCode: string, language: string) => void
  clearResourcesAndCache: () => void
}

const Landing = ({ cities, language, theme, navigateToDashboard, clearResourcesAndCache }: PropsType): ReactElement => {
  const { t } = useTranslation('landing')
  const locationInformation = useLocation()

  const navigateTo = useCallback(
    (cityModel: CityModel) => {
      navigateToDashboard(cityModel.code, language)
    },
    [language, navigateToDashboard]
  )

  return (
    <Wrapper {...testID('Landing-Page')}>
      <Heading clearResourcesAndCache={clearResourcesAndCache} theme={theme} />
      <FilterableCitySelector
        theme={theme}
        cities={cities}
        t={t}
        locationInformation={locationInformation}
        navigateToDashboard={navigateTo}
      />
    </Wrapper>
  )
}

export default Landing
