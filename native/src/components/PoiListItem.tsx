import * as React from 'react'
import { ReactNode } from 'react'
import styled from 'styled-components/native'

import { PoiModel } from 'api-client'
import { ThemeType } from 'build-configs'

import ListItem from './ListItem'

type PropsType = {
  poi: PoiModel
  language: string
  navigateToPoi: () => void
  theme: ThemeType
}
const Description = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
`

class PoiListItem extends React.PureComponent<PropsType> {
  render(): ReactNode {
    const { poi, language, navigateToPoi, theme } = this.props
    const thumbnail = poi.thumbnail
    return (
      <ListItem thumbnail={thumbnail} title={poi.title} language={language} navigateTo={navigateToPoi} theme={theme}>
        {poi.location.location && <Description theme={theme}>{poi.location.location}</Description>}
      </ListItem>
    )
  }
}

export default PoiListItem
