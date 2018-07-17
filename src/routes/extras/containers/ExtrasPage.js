// @flow

import * as React from 'react'
import compose from 'lodash/fp/compose'
import { connect } from 'react-redux'

import SprungbrettList from '../components/SprungbrettList'
import TileModel from 'modules/common/models/TileModel'
import Tiles from 'modules/common/components/Tiles'
import ExtraModel from 'modules/endpoint/models/ExtraModel'
import SprungbrettJobModel from '../../../modules/endpoint/models/SprungbrettJobModel'
import Spinner from 'react-spinkit'
import Caption from '../../../modules/common/components/Caption'
import { translate } from 'react-i18next'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import CityModel from '../../../modules/endpoint/models/CityModel'
import type { I18nTranslateType, StateType } from '../../../flowTypes'
import Helmet from '../../../modules/common/containers/Helmet'

const SPRUNGBRETT_EXTRA = 'sprungbrett'

type PropsType = {
  city: string,
  language: string,
  extraAlias?: string,
  extras: Array<ExtraModel>,
  sprungbrettJobs?: Array<SprungbrettJobModel>,
  t: I18nTranslateType,
  cities: Array<CityModel>
}

/**
 * Displays tiles with all available extras or the page for a selected extra
 */
export class ExtrasPage extends React.Component<PropsType> {
  getSprungbrettPath (): string {
    return `/${this.props.city}/${this.props.language}/extras/${SPRUNGBRETT_EXTRA}`
  }

  getTileModels (): Array<TileModel> {
    return this.props.extras.map(extra => new TileModel({
      id: extra.alias,
      title: extra.title,
      // the url stored in the sprungbrett extra is the url of the endpoint
      path: extra.alias === SPRUNGBRETT_EXTRA ? this.getSprungbrettPath() : extra.path,
      thumbnail: extra.thumbnail,
      // every extra except from the sprungbrett extra is just a link to an external site
      isExternalUrl: extra.alias !== SPRUNGBRETT_EXTRA
    }))
  }

  getContent (): React.Node {
    const LoadingSpinner = () => <Spinner name='line-scale-party' />

    const {extraAlias, extras, sprungbrettJobs, city, language, cities, t} = this.props
    const cityName = CityModel.findCityName(cities, city)
    if (extraAlias) {
      const extra = extras.find(_extra => _extra.alias === extraAlias)

      if (extra && extraAlias === SPRUNGBRETT_EXTRA) {
        return <React.Fragment>
          <Helmet title={`${extra.title} - ${cityName}`} />
          {sprungbrettJobs ? <SprungbrettList title={extra.title} jobs={sprungbrettJobs} /> : <LoadingSpinner />}
        </React.Fragment>
      } else {
      // we currently only implement the sprungbrett extra, so there is no other valid extra path
        const error = new ContentNotFoundError({type: 'extra', id: extraAlias, city, language})
        return <FailureSwitcher error={error} />
      }
    } else {
      return <React.Fragment>
        <Helmet title={`${t('pageTitle')} - ${cityName}`} />
        <Caption title={t('extras')} />
        <Tiles tiles={this.getTileModels()} />
      </React.Fragment>
    }
  }

  render () {
    return this.getContent()
  }
}

const mapStateTypeToProps = (stateType: StateType) => ({
  city: stateType.location.payload.city,
  language: stateType.location.payload.language,
  extraAlias: stateType.location.payload.extraAlias,
  extras: stateType.extras.data,
  sprungbrettJobs: stateType.sprungbrettJobs.data,
  cities: stateType.cities.data
})

export default compose(
  connect(mapStateTypeToProps),
  translate('extras')
)(ExtrasPage)
