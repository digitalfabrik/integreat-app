import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import setLanguageChangeUrls from 'modules/language/actions/setLanguageChangeUrls'

import SprungbrettList from '../components/SprungbrettList'
import TileModel from 'modules/common/models/TileModel'
import Tiles from 'modules/common/components/Tiles'
import ExtraModel from 'modules/endpoint/models/ExtraModel'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import Failure from '../../../modules/common/components/Failure'
import withFetcher from '../../../modules/endpoint/hocs/withFetcher'
import { sprungbrettUrlMapper } from '../../../modules/endpoint/urlMappers'
import sprungbrettMapper from '../../../modules/endpoint/mappers/sprungbrett'

const SPRUNGBRETT_EXTRA = 'sprungbrett'

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
    setLanguageChangeUrls: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.props.setLanguageChangeUrls(this.mapLanguageToPath(this.props.extra), this.props.languages)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.extra !== nextProps.extra) {
      this.props.setLanguageChangeUrls(this.mapLanguageToPath(nextProps.extra), this.props.languages)
    }
  }

  mapLanguageToPath = extra => language => `/${this.props.location}/${language}/extras${extra ? `/${extra}` : ``}`

  getSprungbrettPath () {
    return `/${this.props.location}/${this.props.language}/extras/${SPRUNGBRETT_EXTRA}`
  }

  getTileModels () {
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
    const sprungbrett = this.props.extras.find(extra => extra.alias === SPRUNGBRETT_EXTRA)
    const SprungbrettPageWithFetcher = withFetcher('jobs', sprungbrettUrlMapper, sprungbrettMapper, {url: sprungbrett.path})(SprungbrettList)

    if (this.props.extra === SPRUNGBRETT_EXTRA && sprungbrett) {
      return <SprungbrettPageWithFetcher title={sprungbrett.name} />
    } else if (this.props.extra) {
      // we currently only implement the sprungbrett extra, so there is no other valid extra path
      return <Failure error={'not-found:page.notFound'} />
    } else {
      return <Tiles tiles={this.getTileModels()} />
    }
  }

  render () {
    return this.getContent()
  }
}

const mapStateToProps = state => ({
  location: state.router.params.location,
  language: state.router.params.language,
  extra: state.router.params.extra
})

const mapDispatchToProps = dispatch => ({
  setLanguageChangeUrls: (mapLanguageToPath, languages) => dispatch(setLanguageChangeUrls(mapLanguageToPath, languages))
})

export default connect(mapStateToProps, mapDispatchToProps)(ExtrasPage)
