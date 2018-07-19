// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import TileModel from 'modules/common/models/TileModel'
import Tiles from 'modules/common/components/Tiles'
import ExtraModel from 'modules/endpoint/models/ExtraModel'
import Caption from '../../../modules/common/components/Caption'
import { translate } from 'react-i18next'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import CityModel from '../../../modules/endpoint/models/CityModel'
import type { StateType } from '../../../flowTypes'
import type { TFunction } from 'react-i18next'
import Helmet from '../../../modules/common/containers/Helmet'
import SprungbrettExtra from 'routes/extras/containers/SprungbrettExtra'
import { branch, renderComponent, compose } from 'recompose'
import type { ComponentType } from 'react'

const SPRUNGBRETT_EXTRA = 'sprungbrett'

type PropsType = {
  city: string,
  language: string,
  extras: ?Array<ExtraModel>,

  t: TFunction,
  cities: ?Array<CityModel>
}

/**
 * Displays tiles with all available extras or the page for a selected extra
 */
export class ExtrasPage extends React.Component<PropsType> {
  getSprungbrettPath (): string {
    return `/${this.props.city}/${this.props.language}/extras/${SPRUNGBRETT_EXTRA}`
  }

  getTileModels (extras: Array<ExtraModel>): Array<TileModel> {
    return extras.map(
      extra =>
        new TileModel({
          id: extra.alias,
          title: extra.title,
          // the url stored in the sprungbrett extra is the url of the endpoint
          path: extra.alias === SPRUNGBRETT_EXTRA ? this.getSprungbrettPath() : extra.path,
          thumbnail: extra.thumbnail,
          // every extra except from the sprungbrett extra is just a link to an external site
          isExternalUrl: extra.alias !== SPRUNGBRETT_EXTRA
        })
    )
  }

  render () {
    const { city, cities, extras, t } = this.props

    if (!cities || !extras) {
      throw new Error('Data not ready')
    }

    const cityName = CityModel.findCityName(cities, city)
    // if (internalExtra) {
    // const extra = extras.find(_extra => _extra.alias === internalExtra)

    // if (extra && internalExtra === SPRUNGBRETT_EXTRA) {
    //   return <SprungbrettExtra />
    // } else {
    // // we currently only implement the sprungbrett extra, so there is no other valid extra path
    //   const error = new ContentNotFoundError({type: 'extra', id: internalExtra, city, language})
    //   return <FailureSwitcher error={error} />
    // }

    return (
      <React.Fragment>
        <Helmet title={`${t('pageTitle')} - ${cityName}`} />
        <Caption title={t('extras')} />
        <Tiles tiles={this.getTileModels(extras)} />
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: StateType) => ({
  city: state.location.payload.city,
  language: state.location.payload.language,
  internalExtra: state.location.payload.internalExtra,
  extras: state.extras.data,
  cities: state.cities.data
})

class ExtraFinder extends React.Component<PropsType> {
  render () {
    const extra = extras.find(_extra => _extra.alias === internalExtra)

    if (extra) {
      if (internalExtra == SPRUNGBRETT_EXTRA) {
        return <SprungbrettExtra />
      }
    }
    const error = new ContentNotFoundError({ type: 'extra', id: internalExtra, city, language })
    return <FailureSwitcher error={error} />
  }
}

const preload = test => branch(test, renderComponent(ExtraFinder))

export default compose(
  connect(state => ({ internalExtra: state.location.payload.internalExtra })),
  preload(props => !!props.internalExtra)
)(
  compose(
    connect(mapStateToProps),
    translate('extras')
  )(ExtrasPage)
)
