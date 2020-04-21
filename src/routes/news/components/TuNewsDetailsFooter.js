import React from 'react'
import styled from 'styled-components'



const Footer = styled.footer`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 96%;
  background-color:  #007aa8;
  padding: 0 2% 5px;
  color: white;
  border-radius: 24px
`

const StyledContainer = styled.div`
padding: 5px 10px 0;
`

const StyledSpan = styled.span`
text-decoration: underline;
`

type PropsType<T> = {|
  items: Array < T >,
      |}

class TuNewsDetailsFooter<T> extends React.PureComponent<PropsType<T>> {
  render() {
    const { items } = this.props
    return (
      <Footer>
        <StyledContainer>E-news No: tun0000009902</StyledContainer>
        <StyledContainer><StyledSpan>tünews INTERNATIONAL</StyledSpan></StyledContainer>
        <StyledContainer>20.01.2020 15:16:06</StyledContainer>
      </Footer>
    )
  }
}


export default TuNewsDetailsFooter
