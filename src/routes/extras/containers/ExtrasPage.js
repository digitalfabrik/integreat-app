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

const SPRUNGBRETT_EXTRA = 'sprungbrett'

type Props = {
  city: string,
  language: string,
  extraAlias?: string,
  extras: Array<ExtraModel>,
  sprungbrettJobs?: Array<SprungbrettJobModel>,
  t: (string) => string
}

/**
 * Displays tiles with all available extras or the page for a selected extra
 */
export class ExtrasPage extends React.Component<Props> {
  getSprungbrettPath (): string {
    return `/${this.props.city}/${this.props.language}/extras/${SPRUNGBRETT_EXTRA}`
  }

  getTileModels (): Array<TileModel> {
    return this.props.extras.map(extra => new TileModel({
      id: extra.alias,
      name: extra.title,
      // the url stored in the sprungbrett extra is the url of the endpoint
      path: extra.alias === SPRUNGBRETT_EXTRA ? this.getSprungbrettPath() : extra.path,
      thumbnail: extra.thumbnail,
      // every extra except from the sprungbrett extra is just a link to an external site
      isExternalUrl: extra.alias !== SPRUNGBRETT_EXTRA
    }))
  }

  getContent () {
    const LoadingSpinner = () => <Spinner name='line-scale-party' />

    const {extraAlias, extras, sprungbrettJobs, city, language} = this.props

    if (extraAlias) {
      const extra = extras.find(_extra => _extra.alias === extraAlias)

      if (extra && extraAlias === SPRUNGBRETT_EXTRA) {
        return sprungbrettJobs ? <SprungbrettList title={extra.title} jobs={sprungbrettJobs} /> : <LoadingSpinner />
      } else {
      // we currently only implement the sprungbrett extra, so there is no other valid extra path
        const error = new ContentNotFoundError({type: 'extra', id: extraAlias, city, language})
        return <FailureSwitcher error={error} />
      }
    } else {
      return <React.Fragment>
        <Caption title={this.props.t('extras')} />
        <Tiles tiles={this.getTileModels()} />
      </React.Fragment>
    }
  }

  render () {
    return this.getContent()
  }
}

const mapStateToProps = state => ({
  city: state.location.payload.city,
  language: state.location.payload.language,
  extraAlias: state.location.payload.extraAlias,
  extras: state.extras.data,
  sprungbrettJobs: state.sprungbrettJobs.data
})

export default compose(
  connect(mapStateToProps),
  translate('extras')
)(ExtrasPage)
