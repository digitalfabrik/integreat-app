import React, { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { CityModel } from 'api-client'

import CityNotCooperatingFooter from '../components/CityNotCooperatingFooter'
import CitySelector from '../components/CitySelector'
import Heading from '../components/Heading'
import buildConfig from '../constants/buildConfig'
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
        <CitySelector cities={cities} t={t} navigateToDashboard={navigateTo} />
      </Wrapper>
      {buildConfig().featureFlags.cityNotCooperating && (
        <CityNotCooperatingFooter navigateToCityNotCooperating={navigateToCityNotCooperating} theme={theme} />
      )}
    </>
  )
}

export default Landing
