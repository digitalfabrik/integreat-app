// @flow

import React from 'react'
import { connect } from 'react-redux'

import SprungbrettList from '../components/SprungbrettList'
import TileModel from 'modules/common/models/TileModel'
import Tiles from 'modules/common/components/Tiles'
import ExtraModel from 'modules/endpoint/models/ExtraModel'
import Failure from '../../../modules/common/components/Failure'
import SprungbrettJobModel from '../../../modules/endpoint/models/SprungbrettJobModel'
import Spinner from 'react-spinkit'

const SPRUNGBRETT_EXTRA = 'sprungbrett'

type Props = {
  city: string,
  language: string,
  extraAlias?: string,
  extras: Array<ExtraModel>,
  sprungbrettJobs?: Array<SprungbrettJobModel>
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
      name: extra.name,
      // the url stored in the sprungbrett extra is the url of the endpoint
      path: extra.alias === SPRUNGBRETT_EXTRA ? this.getSprungbrettPath() : extra.path,
      thumbnail: extra.thumbnail,
      // every extra except from the sprungbrett extra is just a link to an external site
      isExternalUrl: extra.alias !== SPRUNGBRETT_EXTRA
    }))
  }

  getContent () {
    const LoadingSpinner = () => <Spinner name='line-scale-party' />

    const {extraAlias, extras, sprungbrettJobs} = this.props

    if (extraAlias) {
      const extra = extras.find(_extra => _extra.alias === extraAlias)

      if (extra && extraAlias === SPRUNGBRETT_EXTRA) {
        return sprungbrettJobs ? <SprungbrettList title={extra.name} jobs={sprungbrettJobs} /> : <LoadingSpinner />
      } else {
      // we currently only implement the sprungbrett extra, so there is no other valid extra path
        return <Failure error={'not-found:page.notFound'} />
      }
    } else {
      return <Tiles tiles={this.getTileModels()} />
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
  extras: state.extras,
  sprungbrettJobs: state.sprungbrettJobs
})

export default connect(mapStateToProps)(ExtrasPage)
