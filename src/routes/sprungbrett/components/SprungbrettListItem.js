// @flow

import React from 'react'

import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'
import styled from 'styled-components'
import ListElement from 'modules/common/components/ListElement'
import CleanAnchor from 'modules/common/components/CleanAnchor'

type PropsType = {|
  job: SprungbrettJobModel
|}

const Description = styled.div`
  margin-left: 10px;
  padding-bottom: 5px;
`

const Title = styled.div`
  padding: 15px 5px 5px;
  font-weight: 700;
`

class SprungbrettListItem extends React.Component<PropsType> {
  render () {
    const job = this.props.job

    return <ListElement>
        <CleanAnchor href={job.url} target='_blank'>
          <Title>{job.title}</Title>
          <Description>{job.location}</Description>
        </CleanAnchor>
    </ListElement>
  }
}

export default SprungbrettListItem
