import React, { ReactElement, useCallback } from 'react'
import { TFunction } from 'react-i18next'

import { SprungbrettJobModel } from 'api-client'
import { ThemeType } from 'build-configs'

import Caption from '../components/Caption'
import List from '../components/List'
import SiteHelpfulBox from '../components/SiteHelpfulBox'
import SprungbrettListItem from '../components/SprungbrettListItem'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'

type PropsType = {
  jobs: Array<SprungbrettJobModel>
  t: TFunction
  theme: ThemeType
  language: string
  title: string
  navigateToFeedback: (isPositiveFeedback: boolean) => void
}

const SprungbrettOffer = ({ jobs, title, navigateToFeedback, theme, t, language }: PropsType): ReactElement => {
  const showSnackbar = useSnackbar()
  const openJob = useCallback(
    (url: string) => () => {
      openExternalUrl(url).catch((error: Error) => showSnackbar(error.message))
    },
    [showSnackbar]
  )
  const renderListItem = useCallback(
    (job: SprungbrettJobModel): React.ReactNode => (
      <SprungbrettListItem
        key={job.id}
        job={job}
        openJobInBrowser={openJob(job.url)}
        theme={theme}
        language={language}
      />
    ),
    [language, theme, openJob]
  )
  return (
    <>
      <Caption title={title} />
      <List noItemsMessage={t('noOffersAvailable')} renderItem={renderListItem} items={jobs} theme={theme} />
      <SiteHelpfulBox navigateToFeedback={navigateToFeedback} />
    </>
  )
}

export default SprungbrettOffer
