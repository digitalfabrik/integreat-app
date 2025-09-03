import { useParams } from 'react-router-dom'

import { CATEGORIES_ROUTE, RESERVED_CITY_CONTENT_SLUGS } from 'shared'

const useCityContentParams = (): { cityCode: string; languageCode: string; route: string } => {
  const params = useParams()
  const slug = params['*']?.split('/')[0]
  const route = slug && (RESERVED_CITY_CONTENT_SLUGS as string[]).includes(slug) ? slug : CATEGORIES_ROUTE
  // This hook should only be used in city content routes where it is guaranteed that both city and language code are set
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return { cityCode: params.cityCode!, languageCode: params.languageCode!, route }
}

export default useCityContentParams
