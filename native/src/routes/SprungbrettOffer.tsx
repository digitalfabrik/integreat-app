import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { SprungbrettJobModel } from 'api-client'

import Caption from '../components/Caption'
import List from '../components/List'
import SiteHelpfulBox from '../components/SiteHelpfulBox'
import SprungbrettListItem from '../components/SprungbrettListItem'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'

const Separator = styled.View`
  border-top-width: 2px;
  border-top-color: ${props => props.theme.colors.themeColor};
`

type PropsType = {
  jobs: Array<SprungbrettJobModel>
  language: string
  title: string
  navigateToFeedback: (isPositiveFeedback: boolean) => void
  refresh: () => void
}

const SprungbrettOffer = ({ jobs, title, navigateToFeedback, language, refresh }: PropsType): ReactElement => {
  const { t } = useTranslation('sprungbrett')
  const showSnackbar = useSnackbar()

  const renderListItem = ({ item }: { item: SprungbrettJobModel }): ReactElement => {
    const openJob = () => openExternalUrl(item.url).catch((error: Error) => showSnackbar(error.message))
    return <SprungbrettListItem key={item.id} job={item} openJobInBrowser={openJob} language={language} />
  }

  return (
    <List
      items={jobs}
      renderItem={renderListItem}
      Header={
        <>
          <Caption title={title} />
          <Separator />
        </>
      }
      Footer={<SiteHelpfulBox navigateToFeedback={navigateToFeedback} />}
      refresh={refresh}
      noItemsMessage={t('currentlyNoEvents')}
    />
  )
}

export default SprungbrettOffer
