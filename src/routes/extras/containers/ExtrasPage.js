import React from 'react'
import PropTypes from 'prop-types'
import compose from 'lodash/fp/compose'
import { connect } from 'react-redux'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import setSprungbrettUrl from 'modules/sprungbrett/actions/setSprungbrettUrl'
import setLanguageChangeUrls from 'modules/language/actions/setLanguageChangeUrls'

import SprungbrettPage from './SprungbrettPage'
import TileModel from 'modules/common/models/TileModel'
import Tiles from 'modules/common/components/Tiles'
import ExtraModel from 'modules/endpoint/models/ExtraModel'
import LanguageModel from 'modules/endpoint/models/LanguageModel'

const SPRUNGBRETT_NAME = 'sprungbrett'

/**
 * Displays tiles with all available extras or the page for a selected extra
 */
export class ExtrasPage extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    extra: PropTypes.string,
    extras: PropTypes.arrayOf(PropTypes.instanceOf(ExtraModel)).isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired,
    setSprungbrettUrl: PropTypes.func.isRequired,
    setLanguageChangeUrls: PropTypes.func.isRequired
  }

  componentWillMount () {
    // if the sprungbrett extra is activated, we have to save it's url to the store to be able to load the endpoint
    if (this.props.extras) {
      const sprungbrett = this.props.extras.find(extra => extra.type === 'ige-sbt')
      if (sprungbrett) {
        // todo take the whole url
        this.props.setSprungbrettUrl(sprungbrett.path.split('=')[1])
      }
      this.props.setLanguageChangeUrls(this.mapLanguageToUrl(this.props.extra), this.props.languages)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.extra !== nextProps.extra) {
      this.props.setLanguageChangeUrls(this.mapLanguageToUrl(nextProps.extra), this.props.languages)
    }
  }

  mapLanguageToUrl = extra => language => `${this.props.location}/${language}/extras${extra ? `/${extra}` : ``}`

  getSprungbrettPath () {
    return `/${this.props.location}/${this.props.language}/extras/sprungbrett`
  }

  getTileModels () {
    return this.props.extras.map(extra => new TileModel({
      id: extra.type,
      name: extra.name,
      // the url stored in the sprungbrett (ige-sbt) extra is the url of the endpoint
      path: extra.type === 'ige-sbt' ? this.getSprungbrettPath() : extra.path,
      thumbnail: extra.thumbnail,
      // every extra apart from the sprungbrett extra is just a link to an external site
      isExternalUrl: extra.type !== 'ige-sbt'
    }))
  }

  render () {
    return this.props.extra === SPRUNGBRETT_NAME ? <SprungbrettPage /> : <Tiles tiles={this.getTileModels()} />
  }
}

const mapStateToProps = state => ({
  location: state.router.params.location,
  language: state.router.params.language,
  extra: state.router.params.extra
})

const mapDispatchToProps = dispatch => ({
  setSprungbrettUrl: url => dispatch(setSprungbrettUrl(url)),
  setLanguageChangeUrls: (mapLanguageToUrl, languages) => dispatch(setLanguageChangeUrls(mapLanguageToUrl, languages))
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFetcher('extras'),
  withFetcher('languages')
)(ExtrasPage)
