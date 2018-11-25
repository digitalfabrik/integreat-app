// @flow

import * as React from 'react'

import { SprungbrettJobModel, ExtraModel, CityModel } from '@integreat-app/integreat-api-client'
import Helmet from '../../../modules/common/containers/Helmet'
import SprungbrettListItem from '../components/SprungbrettListItem'
import type { StateType } from '../../../modules/app/StateType'
import { connect } from 'react-redux'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import type { TFunction } from 'react-i18next'
import { withNamespaces } from 'react-i18next'
import compose from 'lodash/fp/compose'
import List from '../../../modules/common/components/List'
import Caption from '../../../modules/common/components/Caption'

type PropsType = {|
  sprungbrettJobs: Array<SprungbrettJobModel>,
  city: string,
  language: string,
  extras: Array<ExtraModel>,
  cities: Array<CityModel>,
  t: TFunction
|}

export class SprungbrettExtraPage extends React.Component<PropsType> {
  renderSprungbrettListItem = (job: SprungbrettJobModel): React.Node => <SprungbrettListItem key={job.id} job={job} />

  render () {
    const {sprungbrettJobs, extras, cities, city, t} = this.props
    const cityName = CityModel.findCityName(cities, city)
    const extra: ExtraModel | void = extras.find(extra => extra.alias === 'sprungbrett')

    if (!extra) {
      return <FailureSwitcher error={new Error('The Sprunbrett extra is not supported.')} />
    }

    return (
      <>
        <Caption title={extra.title} />
        <Helmet title={`${extra.title} - ${cityName}`} />
        <List noItemsMessage={t('noOffersAvailable')}
              renderItem={this.renderSprungbrettListItem}
              items={sprungbrettJobs} />
      </>
    )
  }
}

const mapStateTypeToProps = (state: StateType) => ({
  city: state.location.payload.city,
  language: state.location.payload.language
})

export default compose(
  connect(mapStateTypeToProps),
  withNamespaces('sprungbrett')
)(SprungbrettExtraPage)
