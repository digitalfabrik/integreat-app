// @flow

import * as React from 'react'
import styled from 'styled-components'
import RemoteContent from './RemoteContent'
import Caption from './Caption'
import type Moment from 'moment'
import LastUpdateInfo from './LastUpdateInfo'

const Thumbnail = styled.img`
  display: flex;
  width: 300px;
  height: 300px;
  margin: 10px auto;
  padding-bottom: 10px;
  object-fit: contain;
`
const StyledContainer = styled.div`
margin-top: 30px !important;
`

type PropsType = {|
  title: string,
  thumbnail?: string,
  content: string,
  lastUpdate?: Moment,
  language: string,
  onInternalLinkClick: string => void,
  hijackRegExp?: RegExp,
  children?: React.Node
|}

/**
 * Display a single page with all necessary information
 */
class Page extends React.PureComponent<PropsType> {
  render () {
    const { title, thumbnail, content, lastUpdate, language, hijackRegExp, children, onInternalLinkClick } = this.props
    return (
      <>
        {thumbnail && <Thumbnail alt='' src={thumbnail} />}
        <Caption title={title} />
        <StyledContainer>
          {children}
        </StyledContainer>
        <RemoteContent dangerouslySetInnerHTML={{ __html: content }}
                       onInternalLinkClick={onInternalLinkClick}
          hijackRegExp={hijackRegExp} />
        {lastUpdate &&
          <StyledContainer>
            <LastUpdateInfo lastUpdate={lastUpdate} language={language} withText={true} />
          </StyledContainer>
        }
      </>
    )
  }
}

export default Page
