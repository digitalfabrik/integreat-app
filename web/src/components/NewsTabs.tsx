import Stack from '@mui/material/Stack'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { LOCAL_NEWS_TYPE, NEWS_ROUTE, NewsType, pathnameFromRouteInformation, TU_NEWS_TYPE } from 'shared'

import Caption from './Caption'
import NewsTab from './NewsTab'

type NewsTabsProps = {
  type: NewsType
  city: string
  localNewsEnabled: boolean
  tunewsEnabled: boolean
  language: string
}

const NewsTabs = ({ language, city, localNewsEnabled, tunewsEnabled, type }: NewsTabsProps): ReactElement => {
  const { t } = useTranslation('news')
  const params = { route: NEWS_ROUTE, cityCode: city, languageCode: language }
  const localNewsPath = pathnameFromRouteInformation({ ...params, newsType: LOCAL_NEWS_TYPE })
  const tunewsPath = pathnameFromRouteInformation({ ...params, newsType: TU_NEWS_TYPE })

  return (
    <>
      <Caption title={t('news')} />
      {localNewsEnabled && tunewsEnabled && (
        <Stack paddingBottom={4} flexDirection='row' justifyContent='center' gap={4}>
          <NewsTab active={type === LOCAL_NEWS_TYPE} type={LOCAL_NEWS_TYPE} destination={localNewsPath} />
          <NewsTab active={type === TU_NEWS_TYPE} type={TU_NEWS_TYPE} destination={tunewsPath} />
        </Stack>
      )}
    </>
  )
}

export default NewsTabs
