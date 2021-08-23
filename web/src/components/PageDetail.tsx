import React, { ReactNode } from 'react'
import styled from 'styled-components'

const Identifier = styled.span`
  font-weight: 700;
`

type PropsType = {
  identifier: string
  information: string
  mapLink?: string
}

class PageDetail extends React.PureComponent<PropsType> {
  render(): ReactNode {
    const { identifier, information, mapLink } = this.props
    return (
      <div>
        <Identifier>{identifier}: </Identifier>
        <span>{information}</span>
        {mapLink && (
          <p>
            <a href={mapLink}>Karte</a>
          </p>
        )}
      </div>
    )
  }
}

export default PageDetail
