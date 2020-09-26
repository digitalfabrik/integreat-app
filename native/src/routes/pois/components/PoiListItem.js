// @flow

import * as React from 'react'
import { PoiModel } from '@integreat-app/integreat-api-client'
import ListItem from '../../../modules/common/components/ListItem'
import styled from 'styled-components/native'
import type { ThemeType } from '../../../modules/theme/constants'

type PropsType = {|
  poi: PoiModel,
  language: string,
  navigateToPoi: () => void,
  theme: ThemeType
|}

const Description = styled.Text`
  color: ${props => props.theme.colors.textColor};
  font-family: ${props => props.theme.fonts.contentFontRegular};
`

class PoiListItem extends React.PureComponent<PropsType> {
  render () {
    const { poi, language, navigateToPoi, theme } = this.props
    const thumbnail = poi.thumbnail
    return (
      <ListItem thumbnail={thumbnail}
        title={poi.title}
                language={language}
                navigateTo={navigateToPoi}
                theme={theme}>
        {poi.location && <Description theme={theme}>{poi.location.location}</Description>}
      </ListItem>
    )
  }
}

export default PoiListItem
