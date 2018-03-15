import { connect } from 'react-redux'
import branch from 'recompose/branch'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import withLayout from './withLayout'
import GeneralHeader from '../components/GeneralHeader'
import GeneralFooter from '../components/GeneralFooter'
import LocationHeader from '../containers/LocationHeader'
import LocationFooter from '../components/LocationFooter'

const mapStateToProps = state => ({
  currentPath: state.router.route,
  location: state.router.params.location,
  language: state.router.params.language,
  viewportSmall: state.viewport.is.small
})

const findLocation = props => props.locations.find(location => location.code === props.location)

const Header = withProps(props => ({ locationModel: findLocation(props) }))(LocationHeader)

export default Toolbar => compose(
  connect(mapStateToProps),
  withFetcher('locations', null, null),
  branch(
    props => !!findLocation(props),
    withLayout(Header, Toolbar, LocationFooter),
    withLayout(GeneralHeader, null, GeneralFooter)
  )
)
