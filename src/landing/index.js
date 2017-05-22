import React from 'react';
import PropTypes from 'prop-types'
import Layout from '../../components/Layout';
import {connect} from "react-redux";

import {fetchLocationsIfNeeded} from "../actions";
import Location from "../../components/Location/Location";

import s from './styles.css';

class LandingPage extends React.Component {

  static propTypes = {
    locations: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(fetchLocationsIfNeeded());
  }

  render() {
    return (
      <Layout className={s.content}>
        <Location locations={this.props.locations}/>
      </Layout>
    );
  }
}


function mapStateToProps(state) {
  return {
    locations: state.fetchLocations.locations,
    isFetching: state.fetchLocations.isFetching
  }
}

export default connect(mapStateToProps)(LandingPage)
