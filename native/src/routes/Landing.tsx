import * as React from 'react'
import { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { CityModel } from 'api-client'

import CityNotCooperatingFooter from '../components/CityNotCooperatingFooter'
import FilterableCitySelector from '../components/FilterableCitySelector'
import Heading from '../components/Heading'
import buildConfig from '../constants/buildConfig'
import useUserLocation from '../hooks/useUserLocation'
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
  navigateToDashboard: (cityCode: string, language: string) => void
  navigateToCityNotCooperating: () => void
  clearResourcesAndCache: () => void
}

const Landing = ({
  cities,
  language,
  navigateToDashboard,
  navigateToCityNotCooperating,
  clearResourcesAndCache
}: PropsType): ReactElement => {
  const { t } = useTranslation('landing')
  const theme = useTheme()
  const locationInformation = useUserLocation()

  const navigateTo = useCallback(
    (cityModel: CityModel) => {
      navigateToDashboard(cityModel.code, language)
    },
    [language, navigateToDashboard]
  )

  return (
    <>
      <Wrapper {...testID('Landing-Page')}>
        <Heading clearResourcesAndCache={clearResourcesAndCache} theme={theme} />
        <FilterableCitySelector
          cities={cities}
          t={t}
          locationInformation={locationInformation}
          navigateToDashboard={navigateTo}
        />
      </Wrapper>
      {buildConfig().featureFlags.cityNotCooperating && (
        <CityNotCooperatingFooter navigateToCityNotCooperating={navigateToCityNotCooperating} theme={theme} />
      )}
    </>
  )
}

export default Landing
