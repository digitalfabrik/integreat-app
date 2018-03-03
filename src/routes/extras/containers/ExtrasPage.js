import React from 'react'
import PropTypes from 'prop-types'
import compose from 'lodash/fp/compose'
import { connect } from 'react-redux'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import setLanguageChangeUrls from 'modules/language/actions/setLanguageChangeUrls'

import SprungbrettPage from './SprungbrettPage'
import TileModel from 'modules/common/models/TileModel'
import Tiles from 'modules/common/components/Tiles'
import ExtraModel from 'modules/endpoint/models/ExtraModel'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import Failure from '../../../modules/common/components/Failure'

const SPRUNGBRETT_EXTRA = 'sprungbrett'
const SPRUNGBRETT_TYPE = 'ige-sbt'

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
    this.props.setLanguageChangeUrls(this.mapLanguageToUrl(this.props.extra), this.props.languages)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.extra !== nextProps.extra) {
      this.props.setLanguageChangeUrls(this.mapLanguageToUrl(nextProps.extra), this.props.languages)
    }
  }

  mapLanguageToUrl = extra => language => `/${this.props.location}/${language}/extras${extra ? `/${extra}` : ``}`

  getSprungbrettPath () {
    return `/${this.props.location}/${this.props.language}/extras/${SPRUNGBRETT_EXTRA}`
  }

  getTileModels () {
    return this.props.extras.map(extra => new TileModel({
      id: extra.type,
      name: extra.name,
      // the url stored in the sprungbrett (ige-sbt) extra is the url of the endpoint
      path: extra.type === SPRUNGBRETT_TYPE ? this.getSprungbrettPath() : extra.path,
      thumbnail: extra.thumbnail,
      // every extra apart from the sprungbrett extra is just a link to an external site
      isExternalUrl: extra.type !== SPRUNGBRETT_TYPE
    }))
  }

  getContent () {
    if (this.props.extra === SPRUNGBRETT_EXTRA && this.props.extras.find(extra => extra.type === SPRUNGBRETT_TYPE)) {
      // todo use title from the cms instead
      return <SprungbrettPage title={'Sprungbrett'} />
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
  setLanguageChangeUrls: (mapLanguageToUrl, languages) => dispatch(setLanguageChangeUrls(mapLanguageToUrl, languages))
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFetcher('extras'),
  withFetcher('languages')
)(ExtrasPage)
