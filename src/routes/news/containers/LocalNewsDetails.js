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
  localNewsList: Array<LocalNewsModel>,
  title: string,
  language: string
|}

// This just a placeholder until the page design is ready
class LocalNewsDetailsPage extends React.PureComponent<PropsType> {
  render() {
    const { localNewsList, title, language } = this.props
    const localNewsItem: any = localNewsList.find(ele => ele.title === title)

    console.log('189',this.props.localNewsList)

    return (
      <Page title={localNewsItem.title} content="" language={language} lastUpdate={localNewsItem.timestamp}>
        {localNewsItem.message}
      </Page>
    )
  }
}

const mapStateTypeToProps = (state: StateType) => {
  return {
    title: state.location.payload.title,
    language: state.location.payload.language,
  }
}

export default compose(
  connect<*, *, *, *, *, *>(mapStateTypeToProps),
  withTranslation('localNewsDetails')
)(LocalNewsDetailsPage)

