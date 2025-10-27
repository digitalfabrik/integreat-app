import MUIList from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { OfferModel, useLoadFromEndpoint, createSprungbrettJobsEndpoint } from 'shared/api'

import List from '../components/base/List'
import FailureSwitcher from './FailureSwitcher'
import SprungbrettListItem from './SprungbrettListItem'

type SprungbrettOfferPageProps = {
  sprungbrettOffer: OfferModel
}

const SprungbrettOffer = ({ sprungbrettOffer }: SprungbrettOfferPageProps): ReactElement | null => {
  const { t } = useTranslation('sprungbrett')

  const { data, error, loading } = useLoadFromEndpoint(createSprungbrettJobsEndpoint, sprungbrettOffer.path, undefined)

  if (loading) {
    return (
      <MUIList>
        {Array.from({ length: 5 }).map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <ListItem disablePadding key={index}>
            <ListItemButton>
              <ListItemAvatar>
                <Skeleton variant='rectangular' width={40} height={40} sx={{ borderRadius: 1 }} />
              </ListItemAvatar>
              <ListItemText
                primary={<Skeleton variant='text' width='80%' height={20} />}
                secondary={<Skeleton variant='text' width='60%' height={18} />}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </MUIList>
    )
  }

  if (!data) {
    return <FailureSwitcher error={error ?? new Error('Data missing')} />
  }

  const items = data.map(job => <SprungbrettListItem key={job.url} job={job} />)

  return <List items={items} NoItemsMessage={t('noOffersAvailable')} />
}

export default SprungbrettOffer
