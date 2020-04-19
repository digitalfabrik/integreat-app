// @flow

import * as React from 'react'
import styled from 'styled-components'
import type Moment from 'moment'
// import LastUpdateInfo from '../../../modules/common/components/LastUpdateInfo'
// import Caption from '../../../modules/common/components/Caption'
import Page from './../../../modules/common/components/Page'

const StyledContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center
`

type PropsType = {|
  title: string,
    message: string,
      timestamp: Moment,
        language: string,
          t: string
            |}

// This just a placeholder until the page design is ready
class LocalNewsDetails extends React.PureComponent<PropsType> {
  render() {
    const { title, message, timestamp, language, t } = this.props
    return (
      <Page title={title} content={message} language={language} lastUpdate={timestamp} />
    )
  }
}

export default LocalNewsDetails
