// @flow

import * as React from 'react'
import styled from 'styled-components'
import type Moment from 'moment'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import Page from '../../../modules/common/components/Page'
import { LocalNewsModel } from '@integreat-app/integreat-api-client'

const StyledContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`

type PropsType = {|
  localNewsDetails: LocalNewsModel,
  title: string,
  language: string
|}

class LocalNewsDetailsPage extends React.PureComponent<PropsType> {
  render() {
    const { localNewsDetails, title, language } = this.props
    const localNewsItem = localNewsDetails[0]

    return (
      <Page title={localNewsItem._title} content="" language={language} lastUpdate={localNewsItem._timestamp}>
        {localNewsItem._message}
      </Page>
    )
  }
}

const mapStateTypeToProps = (state: StateType) => {
  return {
    language: state.location.payload.language,
  }
}

export default compose(
  connect<*, *, *, *, *, *>(mapStateTypeToProps),
  withTranslation('localNewsDetails')
)(LocalNewsDetailsPage)

// const error = new ContentNotFoundError({ type: 'newsItem', id: newsId, city, language })
// return <FailureSwitcher error={error} />
