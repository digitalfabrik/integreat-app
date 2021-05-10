import React, { useCallback } from 'react'
import { SprungbrettJobModel } from 'api-client'
import SprungbrettListItem from './SprungbrettListItem'
import type { TFunction } from 'react-i18next'
import type { ThemeType } from 'build-configs/ThemeType'
import List from '../../../modules/common/components/List'
import Caption from '../../../modules/common/components/Caption'
import openExternalUrl from '../../../modules/common/openExternalUrl'
import SiteHelpfulBox from '../../../modules/common/components/SiteHelpfulBox'
type PropsType = {
  jobs: Array<SprungbrettJobModel>
  t: TFunction
  theme: ThemeType
  language: string
  title: string
  navigateToFeedback: (isPositiveFeedback: boolean) => void
}

const SprungbrettOffer = ({ jobs, title, navigateToFeedback, theme, t, language }: PropsType) => {
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
