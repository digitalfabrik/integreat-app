import Stack from '@mui/material/Stack'
import React, { ReactElement } from 'react'

import { NEWS_ROUTE, RATING_NEGATIVE, RATING_POSITIVE } from 'shared'

import useRegionContentParams from '../hooks/useRegionContentParams'
import useUpdateDimensions from '../hooks/useUpdateDimensions'
import FeedbackToolbarItem from './FeedbackToolbarItem'

export const TOOLBAR_ELEMENT_ID = 'toolbar'

type RegionContentToolbarProps = {
  slug?: string
}

const RegionContentToolbar = ({ slug }: RegionContentToolbarProps): ReactElement | null => {
  const { route } = useRegionContentParams()
  useUpdateDimensions()

  if (route === NEWS_ROUTE) {
    // Feedback is currently not supported for the news route
    return null
  }

  return (
    <Stack id={TOOLBAR_ELEMENT_ID}>
      <FeedbackToolbarItem key='positive' slug={slug} rating={RATING_POSITIVE} />
      <FeedbackToolbarItem key='negative' slug={slug} rating={RATING_NEGATIVE} />
    </Stack>
  )
}
export default RegionContentToolbar
