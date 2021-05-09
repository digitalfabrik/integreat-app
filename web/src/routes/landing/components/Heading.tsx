import React, { useState } from "react";
import type { StyledComponent } from "styled-components";
import styled from "styled-components";
import buildConfig from "../../../modules/app/constants/buildConfig";
import type { ThemeType } from "build-configs/ThemeType";
const Logo: StyledComponent<{}, ThemeType, any> = styled.img`
  display: block;
  height: 70px;
  margin: 0 auto;
`;

const Heading = () => {
  const [counter, setCounter] = useState(0);

  const increment = () => {
    setCounter(counter + 1);
    const CRASH_COUNTER_MAX = 13;

    if (counter === CRASH_COUNTER_MAX) {
      throw new Error('This error was thrown for testing purposes.');
    }
  };

  return <Logo src={buildConfig().icons.locationMarker} alt='' onClick={increment} />;
};

export default Heading;