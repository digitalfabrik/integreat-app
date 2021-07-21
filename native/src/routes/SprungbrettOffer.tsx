import React, { ReactElement, useCallback } from 'react'
import { SprungbrettJobModel } from 'api-client'
import SprungbrettListItem from '../components/SprungbrettListItem'
import { TFunction } from 'react-i18next'
import { ThemeType } from 'build-configs'
import List from '../components/List'
import Caption from '../components/Caption'
import openExternalUrl from '../utils/openExternalUrl'
import SiteHelpfulBox from '../components/SiteHelpfulBox'

type PropsType = {
  jobs: Array<SprungbrettJobModel>
  t: TFunction
  theme: ThemeType
  language: string
  title: string
  navigateToFeedback: (isPositiveFeedback: boolean) => void
}

const SprungbrettOffer = ({ jobs, title, navigateToFeedback, theme, t, language }: PropsType): ReactElement => {
  const openJob = useCallback(
    (url: string) => () => {
      openExternalUrl(url)
    },
    []
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
      <Caption title={title} theme={theme} />
      <List noItemsMessage={t('noOffersAvailable')} renderItem={renderListItem} items={jobs} theme={theme} />
      <SiteHelpfulBox navigateToFeedback={navigateToFeedback} theme={theme} />
    </>
  )
}

export default SprungbrettOffer
