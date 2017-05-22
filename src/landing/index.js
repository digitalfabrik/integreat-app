import React from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';


import Location from "../../components/Location/Location";

class LandingPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      locations: [],
    };
  }

  componentWillMount() {
    fetch('https://cms.integreat-app.de/wp-json/extensions/v1/multisites')
      .then(response => response.json()).then(json => this.setState({locations: json}))
      .catch(ex => {
        throw ex
      });
  }

  render() {
    return (

      <Layout className={s.content}>
        <Location locations={this.state.locations}/>
      </Layout>
    );
  }
}


export default LandingPage;
