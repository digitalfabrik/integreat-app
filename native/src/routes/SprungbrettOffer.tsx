import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import { SprungbrettJobModel } from 'shared/api'

import Caption from '../components/Caption'
import List from '../components/List'
import SprungbrettListItem from '../components/SprungbrettListItem'
import useSnackbar from '../hooks/useSnackbar'
import openExternalUrl from '../utils/openExternalUrl'

const Separator = styled.View`
  border-top-width: 2px;
  border-top-color: ${props => props.theme.colors.themeColor};
`

type SprungbrettOfferProps = {
  jobs: Array<SprungbrettJobModel>
  language: string
  embedded?: boolean
  title?: string
  refresh?: () => void
}

const SprungbrettOffer = ({ jobs, title, language, refresh, embedded }: SprungbrettOfferProps): ReactElement => {
  const { t } = useTranslation('sprungbrett')
  const showSnackbar = useSnackbar()

  const renderListItem = ({ item }: { item: SprungbrettJobModel }): ReactElement => {
    const openJob = () => openExternalUrl(item.url, showSnackbar)
    return <SprungbrettListItem key={item.id} job={item} openJobInBrowser={openJob} language={language} />
  }

  return (
    <List
      items={jobs}
      renderItem={renderListItem}
      Header={
        <>
          {!!title && <Caption title={title} />}
          <Separator />
        </>
      }
      refresh={refresh}
      noItemsMessage={t('noOffersAvailable')}
      scrollEnabled={!embedded}
    />
  )
}

export default SprungbrettOffer
