import React from 'react';
import PropTypes from 'prop-types'
import cx from 'classnames';

import {transform} from "lodash/object";
import {groupBy, sortBy} from "lodash/collection";
import {isEmpty} from "lodash/lang";
import {Link} from "react-router-dom";

import content from './Location.pcss'
import Search from "./Search";
import Header from "./Heading";

class Location extends React.Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    locations: PropTypes.array,
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  static transformLocations(locations) {
    locations = locations.map(location => ({name: location.name, path: location.path}));
    locations = sortBy(locations, ['name']);
    locations = groupBy(locations, (location) => isEmpty(location.name) ? '?' : location.name[0].toUpperCase());
    return locations;
  }

  render() {
    return (
      <div>
        <Header/>
        <Search/>
        <div className={cx(content.languageList, "row")}>
          {
            transform(Location.transformLocations(this.props.locations), (result, locations, key) => {
              if (isEmpty(locations)) {
                return;
              }

              result.push(<div key={key} className={content.languageListParent}>{key}</div>);

              locations.forEach(function (location, index) {
                result.push(<Link to={{
                  pathname: '/location' + location.path
                }} key={key + index} className={content.languageListItem}>
                  <div>{location.name}</div>
                </Link>)
              });
            }, [])
          }
        </div>
      </div>
    );
  }
}

export default Location;
