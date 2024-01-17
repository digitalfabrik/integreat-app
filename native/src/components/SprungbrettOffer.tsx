import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/native'

import {
  createSprungbrettJobsEndpoint,
  OfferModel,
  SprungbrettJobModel,
  useLoadFromEndpoint,
} from '../../../api-client/src'
import useSnackbar from '../hooks/useSnackbar'
import LoadingErrorHandler from '../routes/LoadingErrorHandler'
import openExternalUrl from '../utils/openExternalUrl'
import Caption from './Caption'
import List from './List'
import SprungbrettListItem from './SprungbrettListItem'

const Separator = styled.View`
  border-top-width: 2px;
  border-top-color: ${props => props.theme.colors.themeColor};
`

type SprungbrettOfferProps = {
  sprungbrettOffer: OfferModel
  languageCode: string
}

const SprungbrettOffer = ({ sprungbrettOffer, languageCode }: SprungbrettOfferProps): ReactElement => {
  const { data, ...response } = useLoadFromEndpoint(createSprungbrettJobsEndpoint, sprungbrettOffer.path, undefined)
  const { t } = useTranslation('sprungbrett')
  const showSnackbar = useSnackbar()

  const renderListItem = ({ item }: { item: SprungbrettJobModel }): ReactElement => {
    const openJob = () => openExternalUrl(item.url, showSnackbar)
    return <SprungbrettListItem key={item.id} job={item} openJobInBrowser={openJob} language={languageCode} />
  }

  return (
    <LoadingErrorHandler error={response.error} loading={response.loading} refresh={response.refresh}>
      {data && (
        <List items={data} renderItem={renderListItem} noItemsMessage={t('noOffersAvailable')} scrollEnabled={false} />
      )}
    </LoadingErrorHandler>
  )
}

export default SprungbrettOffer
