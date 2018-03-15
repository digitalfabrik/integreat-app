// @flow

import React from 'react'
import { connect } from 'react-redux'
import Failure from '../../modules/common/components/Failure'
import { goToI18nRedirect } from '../../modules/app/routes/i18nRedirect'
import LanguageSelector from '../../modules/common/containers/LanguageSelector'
import SimpleFailure from '../../modules/common/components/SimpleFailure'

type Props = {
  type: string,
  notFound: string
}

/**
 * Our error component, but since the name Error collides with the ES6 class, we've called it Failure
 */
export class NotFoundPage extends React.Component<Props> {
  render () {
    const {type, notFound} = this.props
    if (type === 'city') {
      return <Failure error={'not-found:page.notFound'} goTo={goToI18nRedirect()} notFound={notFound} />
    } else if (type === 'language') {
      return <LanguageSelector verticalLayout />
    } else {
      return <SimpleFailure error={'not-found:page.notFound'} />
    }
  }
}

const mapStateToProps = state => ({
  type: state.location.payload.type,
  notFound: state.location.payload.notFound,
  city: state.location.payload.city
})

export default connect(mapStateToProps)(NotFoundPage)
