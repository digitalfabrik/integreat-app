import { useParams } from 'react-router'

import { CATEGORIES_ROUTE, RESERVED_REGION_CONTENT_SLUGS } from 'shared'

export const useRouteParams = (): { regionCode?: string; languageCode: string; route: string } => {
  const params = useParams()
  const slug = params['*']?.split('/')[0]
  const route = slug && RESERVED_REGION_CONTENT_SLUGS.includes(slug) ? slug : CATEGORIES_ROUTE
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return { regionCode: params.regionCode, languageCode: params.languageCode!, route }
}

const useRegionContentParams = (): { regionCode: string; languageCode: string; route: string } => {
  const { regionCode, ...rest } = useRouteParams()
  // This hook should only be used in region content routes where it is guaranteed that the region code is set
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return { ...rest, regionCode: regionCode! }
}

export default useRegionContentParams
