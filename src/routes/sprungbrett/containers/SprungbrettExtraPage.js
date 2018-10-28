// @flow

import * as React from 'react'

import SprungbrettJobModel from '../../../modules/endpoint/models/SprungbrettJobModel'
import Helmet from '../../../modules/common/containers/Helmet'
import SprungbrettListItem from '../components/SprungbrettListItem'
import type { StateType } from '../../../modules/app/StateType'
import { connect } from 'react-redux'
import ExtraModel from '../../../modules/endpoint/models/ExtraModel'
import CityModel from '../../../modules/endpoint/models/CityModel'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import { translate } from 'react-i18next'
import type { TFunction } from 'react-i18next'
import compose from 'lodash/fp/compose'
import List from '../../../modules/common/components/List'

type PropsType = {|
  sprungbrettJobs: Array<SprungbrettJobModel>,
  city: string,
  language: string,
  extras: ?Array<ExtraModel>,
  cities: ?Array<CityModel>,
  t: TFunction
|}

export class SprungbrettExtraPage extends React.Component<PropsType> {
  renderSprungbrettListItem = (job: SprungbrettJobModel): React.Node => <SprungbrettListItem key={job.id} job={job} />

  render () {
    const {sprungbrettJobs, extras, cities, city, t} = this.props
    if (!extras || !cities) {
      throw new Error('Payload not available')
    }

    const cityName = CityModel.findCityName(cities, city)
    const extra: ExtraModel | void = extras.find(extra => extra.alias === 'sprungbrett')

    if (!extra) {
      return <FailureSwitcher error={new Error('The Sprunbrett extra is not supported.')} />
    }

    return (
      <>
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
  translate('sprungbrett')
)(SprungbrettExtraPage)
