import * as React from 'react'
import { LANDING_ROUTE } from '../app/routes/landing'
import Layout from './components/Layout'
import GeneralFooter from './components/GeneralFooter'
import LocationLayout, {LocationLayoutRoutes} from './containers/LocationLayout'
import GeneralHeader from './components/GeneralHeader'

const withLayout = (route: string) => (WrappedComponent: React.Component) => {
  return class WrappedComponentWithLayout extends React.Component {
    render () {
      if (route === LANDING_ROUTE) {
        return (
          <Layout footer={<GeneralFooter />}>
            <WrappedComponent {...this.props} />
          </Layout>
        )
      } else if (LocationLayoutRoutes.includes(route)) {
        return (
          <LocationLayout>
            <WrappedComponent {...this.props} />
          </LocationLayout>
        )
      } else {
        return (
          <Layout header={<GeneralHeader />} footer={<GeneralFooter />}>
            <WrappedComponent {...this.props} />
          </Layout>
        )
      }
    }
  }
}

export default withLayout
