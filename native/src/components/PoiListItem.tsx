import * as React from 'react'
import { PoiModel } from 'api-client'
import ListItem from './ListItem'
import styled from 'styled-components/native'
import { ThemeType } from 'build-configs'

type PropsType = {
  poi: PoiModel
  language: string
  navigateToPois: () => void
  theme: ThemeType
}
const Description = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.native.contentFontRegular};
`

class PoiListItem extends React.PureComponent<PropsType> {
  render() {
    const { poi, language, navigateToPois, theme } = this.props
    const thumbnail = poi.thumbnail
    return (
      <ListItem thumbnail={thumbnail} title={poi.title} language={language} navigateTo={navigateToPois} theme={theme}>
        {poi.location && <Description theme={theme}>{poi.location.location}</Description>}
      </ListItem>
    )
  }
}

export default PoiListItem
