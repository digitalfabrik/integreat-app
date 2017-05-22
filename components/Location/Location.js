import React from 'react';
import PropTypes from 'prop-types'
import cx from 'classnames';

import {transform} from "lodash/object";
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
    locations: PropTypes.object,
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <Header/>
        <Search/>
        <div className={cx(content.languageList, "row")}>
          {
            transform(this.props.locations, (result, locations, key) => {
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
