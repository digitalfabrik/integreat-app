import { useEffect } from 'react'

import { CategoriesRouteType, EventsRouteType, NewsRouteType, PoisRouteType } from 'api-client'

import { NavigationProps } from '../constants/NavigationTypes'

type UseSetRouteTitleProps = {
  navigation: NavigationProps<CategoriesRouteType | EventsRouteType | NewsRouteType | PoisRouteType>
  title?: string
}

/**
 * Allows custom overriding of the route title
 * The route title is used in the header of the afterwards opened route to show the user where he would navigate back to
 * The route name is shown as default
 */
const useSetRouteTitle = ({ navigation, title }: UseSetRouteTitleProps): void => {
  useEffect(() => {
    navigation.setParams({ title })
  }, [navigation, title])
}

export default useSetRouteTitle
