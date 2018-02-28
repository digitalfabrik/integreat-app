import React from 'react'
import PropTypes from 'prop-types'
import compose from 'lodash/fp/compose'
import { connect } from 'react-redux'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import { setSprungbrettUrl } from 'modules/sprungbrett/actions/setSprungbrettUrl'

import SprungbrettPage from './SprungbrettPage'
import TileModel from '../../../modules/common/models/TileModel'
import Tiles from '../../../modules/common/components/Tiles'
import ExtraModel from '../../../modules/endpoint/models/ExtraModel'
import LanguageModel from '../../../modules/endpoint/models/LanguageModel'

const SPRUNGBRETT_NAME = 'sprungbrett'

export class ExtrasPage extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    extra: PropTypes.string,
    extras: PropTypes.arrayOf(PropTypes.instanceOf(ExtraModel)).isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    setSprungbrettUrl: PropTypes.func.isRequired
  }

  componentWillMount () {
    if (this.props) {
      const sprungbrett = this.props.extras.find(extra => extra.type === 'ige-sbt')
      if (sprungbrett) {
        // todo take the whole url
        this.props.setSprungbrettUrl(sprungbrett.path.split('=')[1])
      }
    }
  }

  getSprungbrettPath () {
    return `/${this.props.location}/${this.props.language}/extras/sprungbrett/all`
  }

  getTileModels () {
    return this.props.extras.map(extra => new TileModel({
      id: extra.type,
      name: extra.name,
      path: extra.type === 'ige-sbt' ? this.getSprungbrettPath() : extra.path,
      thumbnail: extra.thumbnail,
      isExternalUrl: extra.type !== 'ige-sbt'
    }))
  }

  render () {
    return this.props.extra === SPRUNGBRETT_NAME ? <SprungbrettPage languages={this.props.languages} /> : <Tiles tiles={this.getTileModels()} />
  }
}

const mapStateToProps = state => ({
  location: state.router.params.location,
  language: state.router.params.language,
  extra: state.router.params.extra
})

const mapDispatchToProps = dispatch => ({
  setSprungbrettUrl: url =>
    dispatch(setSprungbrettUrl(url))
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFetcher('extras'),
  withFetcher('languages')
)(ExtrasPage)
