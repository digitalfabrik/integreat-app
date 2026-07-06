import Stack from '@mui/material/Stack'
import React, { ReactElement } from 'react'

import { NEWS_ROUTE, RATING_NEGATIVE, RATING_POSITIVE } from 'shared'

import { TOOLBAR_ELEMENT_ID } from '../constants/layout'
import useRegionContentParams from '../hooks/useRegionContentParams'
import useUpdateDimensions from '../hooks/useUpdateDimensions'
import FeedbackToolbarItem from './FeedbackToolbarItem'

const RegionContentToolbar = (): ReactElement | null => {
  const { route } = useRegionContentParams()
  useUpdateDimensions()

  if (route === NEWS_ROUTE) {
    // Feedback is currently not supported for the news route
    return null
  }

  return (
    <Stack id={TOOLBAR_ELEMENT_ID}>
      <FeedbackToolbarItem key='positive' rating={RATING_POSITIVE} />
      <FeedbackToolbarItem key='negative' rating={RATING_NEGATIVE} />
    </Stack>
  )
}
export default RegionContentToolbar
