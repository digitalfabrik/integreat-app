import Failure from "../Failure";
import { fireEvent, render } from "@testing-library/react-native";
import * as React from "react";
import { lightTheme } from "../../../theme/constants";
import ErrorCodes from "../../ErrorCodes";
describe('Failure', () => {
  it('should render a retry button if tryAgain is passed', () => {
    const {
      getByTestId
    } = render(<Failure theme={lightTheme} tryAgain={() => {}} code={ErrorCodes.UnknownError} t={key => key} />);
    expect(getByTestId('button-tryAgain')).toBeTruthy();
  });
  it('should not render a retry button if tryAgain is not passed', () => {
    const {
      queryByTestId
    } = render(<Failure theme={lightTheme} code={ErrorCodes.UnknownError} t={key => key} />);
    expect(queryByTestId('button-tryAgain')).toBeNull();
  });
  it('should have a correct message as title', () => {
    const {
      getByText
    } = render(<Failure theme={lightTheme} code={ErrorCodes.UnknownError} t={key => key} />);
    expect(getByText(ErrorCodes.UnknownError)).toBeTruthy();
  });
  it('should try again if button is pressed', () => {
    const tryAgain = jest.fn();
    const {
      getByTestId
    } = render(<Failure theme={lightTheme} code={ErrorCodes.UnknownError} tryAgain={tryAgain} t={key => key} />);
    fireEvent.press(getByTestId('button-tryAgain'));
    expect(tryAgain).toHaveBeenCalled();
  });
});