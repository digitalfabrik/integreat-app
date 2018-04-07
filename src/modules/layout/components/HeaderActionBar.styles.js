import styled from 'styled-components'

export const ActionItems = styled.div`
  justify-content: flex-end;
  
  & > *,
  & img {
    width: calc(0.8 * ${props => props.theme.dimensions.headerHeightLarge}px);
    height: calc(0.8 * ${props => props.theme.dimensions.headerHeightLarge}px);
    box-sizing: border-box;
    cursor: pointer;
    
    @media ${props => props.theme.dimensions.smallViewport} {
      width: calc(0.8 * ${props => props.theme.dimensions.headerHeightSmall}px);
      height: calc(0.8 * ${props => props.theme.dimensions.headerHeightSmall}px);
    }
  }
  
  & img {
    box-sizing: border-box;
    padding: 22%;
    object-fit: contain;
  }
`
