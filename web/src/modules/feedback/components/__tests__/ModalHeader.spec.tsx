import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { ModalHeader } from "../ModalHeader";
import { ThemeProvider } from "styled-components";
import lightTheme from "../../../theme/constants/theme";
describe('ModalHeader', () => {
  it('should call close function when clicking on close', () => {
    const onCloseFeedbackModal = jest.fn();
    const {
      getByRole
    } = render(<ThemeProvider theme={lightTheme}>
        <ModalHeader t={key => key} closeFeedbackModal={onCloseFeedbackModal} title='title' />
      </ThemeProvider>);
    const closeButton = getByRole('button', {
      name: 'close'
    });
    fireEvent.click(closeButton);
    expect(onCloseFeedbackModal).toBeCalled();
  });
});