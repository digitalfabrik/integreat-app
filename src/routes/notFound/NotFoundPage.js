// @flow

import React from 'react'
import { connect } from 'react-redux'
import Failure from '../../modules/common/components/Failure'
import { goToI18nRedirect } from '../../modules/app/routes/i18nRedirect'
import LanguageSelector from '../../modules/common/containers/LanguageSelector'

type Props = {
  city: string,
  language?: string
}

/**
 * Our error component, but since the name Error collides with the ES6 class, we've called it Failure
 */
export class NotFoundPage extends React.Component<Props> {
  render () {
    const {city, language} = this.props
    if (language) {
      return <LanguageSelector verticalLayout />
    } else {
      return <Failure error={'not-found:page.notFound'} goTo={goToI18nRedirect()} notFound={city} />
    }
  }
}

const mapStateToProps = state => ({
  type: state.location.payload.type,
  notFound: state.location.payload.notFound,
  city: state.location.payload.city
})

export default connect(mapStateToProps)(NotFoundPage)
