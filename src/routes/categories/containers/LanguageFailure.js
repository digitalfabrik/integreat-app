import React from 'react'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'
import LanguageSelector from 'modules/common/containers/LanguageSelector'
import setLanguageChangeUrls from 'modules/language/actions/setLanguageChangeUrls'
import { compose } from 'redux'
import { connect } from 'react-redux'
import withFetcher from 'modules/endpoint/hocs/withFetcher'
import LanguageModel from 'modules/endpoint/models/LanguageModel'
import LocationModel from '../../../modules/endpoint/models/LocationModel'
import Caption from '../../../modules/common/components/Caption'
import style from './LanguageFailure.css'

export class LanguageFailure extends React.PureComponent {
  static propTypes = {
    setLanguageChangeUrls: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    location: PropTypes.string.isRequired,
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired,
    languages: PropTypes.arrayOf(PropTypes.instanceOf(LanguageModel)).isRequired
  }

  /**
   * The function used to map different languages to their CategoriesPage
   * @param {string} language The language
   * @returns {string} The url of the CategoriesPage of a different language
   */
  mapLanguageToUrl = language => `/${this.props.location}/${language}`

  /**
   * Gets and stores the available languages for the current page
   */
  setLanguageChangeUrls () {
    this.props.setLanguageChangeUrls(this.mapLanguageToUrl, this.props.languages)
  }

  componentWillMount () {
    this.setLanguageChangeUrls()
  }

  getTitle () {
    return this.props.locations.find(location => location.code === this.props.location).name
  }

  render () {
    return <React.Fragment>
      <Caption title={this.getTitle()} />
      <p className={style.chooseLanguage}>{this.props.t('common:chooseYourLanguage')}</p>
      <LanguageSelector verticalLayout />
    </React.Fragment>
  }
}

const mapDispatchToProps = dispatch => ({
  setLanguageChangeUrls: (mapLanguageToUrl, languages) => dispatch(setLanguageChangeUrls(mapLanguageToUrl, languages))
})

const mapStateToProps = state => ({
  location: state.router.params.location
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFetcher('locations'),
  withFetcher('languages'),
  translate('common')
)(LanguageFailure)
