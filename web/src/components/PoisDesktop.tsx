import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { PoiFeature, PoiModel } from 'api-client'
import { UiDirectionType } from 'translations'

import dimensions from '../constants/dimensions'
import PoiDetails from './PoiDetails'
import PoiPanelNavigation from './PoiPanelNavigation'

const ListViewWrapper = styled.div<{ panelHeights: number }>`
  width: 300px;
  padding: 0 clamp(16px, 1.4vh, 32px);
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
  padding-top: clamp(16px, 1.4vh, 32px);
  padding-bottom: clamp(10px, 1vh, 20px);
  text-align: center;
  font-size: 18px;
  font-family: ${props => props.theme.fonts.web.decorativeFont};
  line-height: ${props => props.theme.fonts.decorativeLineHeight};
  font-weight: 600;
  border-bottom: 1px solid ${props => props.theme.colors.poiBorderColor};
  margin-bottom: clamp(10px, 1vh, 20px);
`

type PoisDesktopProps = {
  panelHeights: number
  currentFeature: PoiFeature | null
  poiList: ReactElement
  mapView: ReactElement | null
  toolbar: ReactElement
  poi?: PoiModel
  switchFeature: (step: 1 | -1) => void
  selectFeature: (feature: PoiFeature | null) => void
  direction: UiDirectionType
  showFeatureSwitch: boolean
}

const PoisDesktop: React.FC<PoisDesktopProps> = ({
  panelHeights,
  currentFeature,
  poiList,
  mapView,
  toolbar,
  poi,
  switchFeature,
  selectFeature,
  direction,
  showFeatureSwitch
}: PoisDesktopProps): ReactElement => {
  const { t } = useTranslation('pois')

  return (
    <>
      <div>
        <ListViewWrapper panelHeights={panelHeights}>
          {!currentFeature && <ListHeader>{t('listTitle')}</ListHeader>}
          {currentFeature && poi ? (
            <PoiDetails poi={poi} feature={currentFeature} selectFeature={selectFeature} direction={direction} />
          ) : (
            poiList
          )}
        </ListViewWrapper>
        {currentFeature && showFeatureSwitch ? (
          <PoiPanelNavigation switchFeature={switchFeature} direction={direction} />
        ) : (
          <ToolbarContainer>{toolbar}</ToolbarContainer>
        )}
      </div>
      {mapView}
    </>
  )
}

export default PoisDesktop
