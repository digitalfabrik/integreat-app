import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { PoiFeature } from 'api-client'

import dimensions from '../constants/dimensions'

const ListViewWrapper = styled.div<{ panelHeights: number }>`
  min-width: 370px;
  padding: 0 32px;
  overflow: auto;
  ${({ panelHeights }) => `height: calc(100vh - ${panelHeights}px - ${dimensions.toolbarHeight}px);`};
`

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${props => props.theme.colors.backgroundAccentColor};
  box-shadow: 1px 0 4px 0 rgba(0, 0, 0, 0.2);
`

const ListHeader = styled.div`
  padding-top: 32px;
  padding-bottom: 20px;
  text-align: center;
  font-size: 18px;
  font-family: ${props => props.theme.fonts.web.decorativeFont};
  line-height: ${props => props.theme.fonts.decorativeLineHeight};
  font-weight: 600;
  border-bottom: 1px solid ${props => props.theme.colors.textDecorationColor};
  margin-bottom: 20px;
`
type PoisDesktopProps = {
  panelHeights: number
  currentFeature: PoiFeature | null
  poiList: ReactElement
  sortedPois: PoiFeature[]
  mapView: ReactElement | null
  toolbar: ReactElement
}

const PoisDesktop: React.FC<PoisDesktopProps> = ({
  panelHeights,
  currentFeature,
  poiList,
  sortedPois,
  mapView,
  toolbar
}: PoisDesktopProps): ReactElement => {
  const { t } = useTranslation('pois')
  return (
    <>
      <div>
        <ListViewWrapper panelHeights={panelHeights}>
          <ListHeader>{currentFeature?.properties.title || t('listTitle')}</ListHeader>
          {!currentFeature && sortedPois.length > 0 && poiList}
        </ListViewWrapper>
        <ToolbarContainer>{toolbar}</ToolbarContainer>
      </div>
      {mapView}
    </>
  )
}

export default PoisDesktop
