// @flow

import * as React from 'react'
import styled from 'styled-components'
import type Moment from 'moment'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'
import { withTranslation } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import Page from '../../../modules/common/components/Page'
import { LocalNewsModel } from '@integreat-app/integreat-api-client'
import NewsController from './../containers/NewsController'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'

const StyledContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`

type PropsType = {|
  localNewsDetails: LocalNewsModel,
  title: string,
  language: string,
  city: string,
  path: string,
|}

class LocalNewsDetailsPage extends React.PureComponent<PropsType> {
  render() {
    const { localNewsDetails, title, language, city, path } = this.props
    const localNewsItem = localNewsDetails[0]

    if (!localNewsItem) {
      const error = new ContentNotFoundError({ type: 'newsItem', id: path, city, language })
      return <FailureSwitcher error={error} />
    }

    return (
      <NewsController>
        <Page title={localNewsItem._title} content="" language={language} lastUpdate={localNewsItem._timestamp}>
          {localNewsItem._message}
        </Page>
      </NewsController>
    )
  }
}

const mapStateTypeToProps = (state: StateType) => (
  {
    language: state.location.payload.language,
    city: state.location.payload.city,
    path: state.location.pathname
  }
)

export default compose(
  connect<*, *, *, *, *, *>(mapStateTypeToProps),
  withTranslation('localNewsDetails')
)(LocalNewsDetailsPage)

