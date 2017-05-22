import React from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';

class LocationPage extends React.Component {

  render() {
    return (
      <Layout className={s.content}>
        {this.props.match.params.location}
      </Layout>
    );
  }
}


export default LocationPage;
