import React, { ReactElement, useCallback, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { BOTTOM_TAB_ROUTE, SUGGEST_TO_REGION_ROUTE, LandingRouteType } from 'shared'
import { RegionModel } from 'shared/api'

import RegionSelector from '../components/RegionSelector'
import SuggestToRegionFooter from '../components/SuggestToRegionFooter'
import SwitchCmsUrlIcon from '../components/SwitchCmsUrlIcon'
import Text from '../components/base/Text'
import { NavigationProps } from '../constants/NavigationTypes'
import buildConfig from '../constants/buildConfig'
import { AppContext } from '../contexts/AppContextProvider'
import useLoadRegions from '../hooks/useLoadRegions'
import testID from '../testing/testID'
import dataContainer from '../utils/DefaultDataContainer'
import { reportError } from '../utils/sentry'
import LoadingErrorHandler from './LoadingErrorHandler'

const Wrapper = styled(View)`
  background-color: ${props => props.theme.colors.background};
  padding: 20px;
  flex-grow: 1;
  gap: 16px;
`

type LandingProps = {
  navigation: NavigationProps<LandingRouteType>
}

const Landing = ({ navigation }: LandingProps): ReactElement => {
  const { data: regions, refresh, ...response } = useLoadRegions()
  const { changeRegionCode } = useContext(AppContext)
  const { t } = useTranslation('landing')

  // The regions are otherwise only updated by pull to refresh
  useEffect(refresh, [refresh])

  const navigateToDashboard = (region: RegionModel) => {
    changeRegionCode(region.code)
    navigation.reset({ index: 0, routes: [{ name: BOTTOM_TAB_ROUTE, params: {} }] })
  }

  const clearResourcesAndCache = useCallback(() => {
    dataContainer.clearInMemoryCache()
    dataContainer._clearOfflineCache().catch(reportError)
    refresh()
  }, [refresh])

  return (
    <LoadingErrorHandler {...response} refresh={refresh} scrollView>
      {regions && (
        <>
          <Wrapper {...testID('Landing-Page')}>
            <SwitchCmsUrlIcon clearResourcesAndCache={clearResourcesAndCache} />
            <Text variant='h3'>{t('welcome', { appName: buildConfig().appName })}</Text>
            <Text variant='body2'>{t('welcomeInformation')}</Text>
            <RegionSelector regions={regions} navigateToDashboard={navigateToDashboard} />
          </Wrapper>
          <SuggestToRegionFooter navigateToSuggestToRegion={() => navigation.navigate(SUGGEST_TO_REGION_ROUTE)} />
        </>
      )}
    </LoadingErrorHandler>
  )
}

export default Landing
