// @flow

import * as React from 'react'
import { useCallback, useContext } from 'react'
import { connect } from 'react-redux'
import Page from '../../../modules/common/components/Page'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import { NotFoundError, PoiModel } from 'api-client'
import { withTranslation, TFunction } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import PageDetail from '../../../modules/common/components/PageDetail'
import PoiListItem from '../components/PoiListItem'
import Caption from '../../../modules/common/components/Caption'
import List from '../../../modules/common/components/List'
import { push } from 'redux-first-router'
import DateFormatterContext from '../../../modules/i18n/context/DateFormatterContext'

type PropsType = {|
  pois: Array<PoiModel>,
  city: string,
  poiId: ?string,
  language: string,
  t: typeof TFunction
|}

/**
 * Displays a list of pois or a single poi, matching the route /<city>/<language>/locations(/<id>)
 */
export const PoisPage = ({
  pois,
  poiId,
  city,
  language,
  t
}: PropsType) => {
  const formatter = useContext(DateFormatterContext)
  const renderPoiListItem = useCallback((poi: PoiModel) => <PoiListItem key={poi.path} poi={poi} />, [])

  if (poiId) {
    const poi = pois.find(_poi => _poi.path === `/${city}/${language}/locations/${poiId}`)

    if (poi) {
      const location = poi.location.location
      return (
        <Page defaultThumbnailSrc={poi.thumbnail}
              lastUpdate={poi.lastUpdate}
              content={poi.content}
              title={poi.title}
              formatter={formatter}
              onInternalLinkClick={push}>
          {location && <PageDetail identifier={t('location')} information={location} />}
        </Page>
      )
    } else {
      const error = new NotFoundError({
        type: 'poi',
        id: poiId,
        city,
        language
      })
      return <FailureSwitcher error={error} />
    }
  }

  const sortedPois = pois.sort((poi1, poi2) => poi1.title.localeCompare(poi2.title))
  return <>
    <Caption title={t('pois')} />
    <List noItemsMessage={t('noPois')} items={sortedPois} renderItem={renderPoiListItem} />
  </>
}

const mapStateTypeToProps = (state: StateType) => ({
  language: state.location.payload.language,
  city: state.location.payload.city,
  poiId: state.location.payload.poiId
})

export default connect<*, *, *, *, *, *>(mapStateTypeToProps)(
  withTranslation('pois')(
    PoisPage
  ))
