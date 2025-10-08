import { useParams } from 'react-router-dom'

import { CATEGORIES_ROUTE, RESERVED_CITY_CONTENT_SLUGS } from 'shared'

export const useRouteParams = (): { cityCode?: string; languageCode: string; route: string } => {
  const params = useParams()
  const slug = params['*']?.split('/')[0]
  const route = slug && RESERVED_CITY_CONTENT_SLUGS.includes(slug) ? slug : CATEGORIES_ROUTE
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return { cityCode: params.cityCode, languageCode: params.languageCode!, route }
}

const useCityContentParams = (): { cityCode: string; languageCode: string; route: string } => {
  const { cityCode, ...rest } = useRouteParams()
  // This hook should only be used in city content routes where it is guaranteed that the city code is set
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return { ...rest, cityCode: cityCode! }
}

export default useCityContentParams
