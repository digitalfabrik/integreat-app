
// @flow

import * as React from 'react'
import styled from 'styled-components'

import TuNewsLogo from '../assets/TuNewsLogo.png'

const StyledBanner = styled.div`
  height: 60px;
  background-color: rgba(2, 121, 166, 0.4);
  border-radius: 11px;
  overflow: hidden;
`
const Logo = styled.img`
  height: 100%;
`

const StyledFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 28px;
  border-radius: 11px;
  color: white;
  background-color: #0279a6;
`

class TuNewsOverView extends React.PureComponent<PropsType> {
  render () {
    return (
      <div
        style={{
          maxWidth: 660
        }}
        >
        <StyledBanner>
          <Logo src={TuNewsLogo} alt='logo' />
        </StyledBanner>

        <p>
          Wenn man über das Internet eine neue Wohnung finden möchte, ist es wichtig, eine seriöse App oder
          Webseite zu benutzen. Wenn man eine Wohnung gefunden hat, sollte man einen Besichtigungstermin mit dem
          Vermieter vereinbaren. Vor einer Besichtigung sollte man auf keinen Fall Bankdaten austauschen oder Geld
          bezahlen. Auch für eine Besichtigung bezahlt man normalerweise nicht. Man sollte allgemein darauf
          achten, dass man kein Geld überweist, bevor man den Vertrag unterschrieben und den Wohnungsschlüssel
          bekommen hat. Weitere Informationen zu solchen Betrugsfällen kann man zum Beispiel hier finden:
          https://sicherheit.immobilienscout24.de/ tünews INTERNATIONAL, www.tunews.de, 0000014101
        </p>

        <StyledFooter>E-news No: tun 0000014101 - TüNews INTERNATIONAL - 2019-07-10 15:16:06</StyledFooter>
      </div>
    )
  }
}

export default TuNewsOverView
