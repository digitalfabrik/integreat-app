// @flow

import * as React from 'react'
import styled from 'styled-components'
import type Moment from 'moment'
import Page from './../../../modules/common/components/Page'

const StyledContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`

type PropsType = {|
  title: string,
  message: string,
  timestamp: Moment,
  language: string,
|}

class LocalNewsDetails extends React.PureComponent<PropsType> {
  render() {
    const { title, message, timestamp, language} = this.props
    return (
      <Page title={title} content="" language={language} lastUpdate={timestamp}>
        {message}
      </Page>
    )
  }
}

export default LocalNewsDetails
