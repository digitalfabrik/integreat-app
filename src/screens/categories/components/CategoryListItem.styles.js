import styled from 'styled-components'

export const Row = styled.View`
  margin: 12px 0;
  
  & > * {
    width: 100%;
  }
`

export const SubCategory = styled.View`
  text-align: end;
  
  & > * {
    width: calc(100% - 60px);
    text-align: start;
    
    @media ${props => props.theme.dimensions.smallViewport} {
      width: calc(100% - 8px);
    }
  }
`

export const CategoryThumbnail = styled.Image`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  padding: 8px;
  object-fit: contain;
`

export const CategoryCaption = styled.View`
  height: 100%;
  min-width: 1px; /* needed to enable line breaks for to long words, exact value doesn't matter */
  flex-grow: 1;
  padding: 15px 5px;
  border-bottom: 2px solid ${props => props.theme.colors.themeColor};
  word-wrap: break-word;
`

export const SubCategoryCaption = CategoryCaption.extend`
  padding: 8px 0;
  border-bottom: 1px solid ${props => props.theme.colors.themeColor};
`

export const StyledLink = styled.Text`
  display: inline-flex;
  align-items: center;
  margin: 0 auto;
`
