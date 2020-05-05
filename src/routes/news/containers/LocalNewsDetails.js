// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'
import { withTranslation } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import Page from '../../../modules/common/components/Page'
import { LocalNewsModel } from '@integreat-app/integreat-api-client'
import NewsController from './../containers/NewsController'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'

type PropsType = {|
  localNewsDetails: LocalNewsModel,
  title: string,
  language: string,
  city: string,
  path: string
|}

class LocalNewsDetailsPage extends React.PureComponent<PropsType> {
  render () {
    const { localNewsDetails, language, city, path, id } = this.props

    if (!localNewsDetails) {
      const error = new ContentNotFoundError({ type: 'newsItem', id: path, city, language })
      return <FailureSwitcher error={error} />
    }

    return (
      <NewsController>
        <Page title={localNewsDetails._title} content='' language={language} lastUpdate={localNewsDetails._timestamp}>
          {localNewsDetails._message}
        </Page>
      </NewsController>
    )
  }
}

const mapStateTypeToProps = (state: StateType) => (
  {
    language: state.location.payload.language,
    city: state.location.payload.city,
    path: state.location.pathname,
    id: state.location.payload.id
  }
)

export default compose(
  connect<*, *, *, *, *, *>(mapStateTypeToProps),
  withTranslation('localNewsDetails')
)(LocalNewsDetailsPage)
