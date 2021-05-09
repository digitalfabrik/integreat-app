import React from "react";
import { render } from "@testing-library/react-native";
import SnackbarContainer from "../SnackbarContainer";
let mockDispatch;
let mockUseSelector;
jest.useFakeTimers();
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: text => text
  })
}));
jest.mock('../../components/Snackbar', () => {
  const Text = require('react-native').Text;

  return ({
    message
  }: {
    message: string;
  }) => <Text>{message}</Text>;
});
jest.mock('react-redux', () => {
  const dispatch = jest.fn();
  mockDispatch = dispatch;
  const useDispatch = jest.fn(() => dispatch);
  const useSelector = jest.fn();
  mockUseSelector = useSelector;
  return {
    useSelector,
    useDispatch
  };
});
describe('SnackbarContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  it('should show a snackbar if included in the state', async () => {
    mockUseSelector.mockImplementation(() => []);
    const snackbarText1 = 'snackbarText1';
    const snackbarText2 = 'snackbarText2';
    const {
      update,
      queryByText
    } = render(<SnackbarContainer />);
    expect(queryByText(snackbarText1)).toBeFalsy();
    expect(queryByText(snackbarText2)).toBeFalsy();
    // Simulate two new snackbars have been pushed to the redux store
    mockUseSelector.mockImplementation(() => [{
      text: snackbarText1
    }, {
      text: snackbarText2
    }]);
    await update(<SnackbarContainer />);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'DEQUEUE_SNACKBAR'
    });
    // Simulate pop of snackbar from the redux store (triggered by DEQUEUE_SNACKBAR action)
    mockUseSelector.mockImplementation(() => [{
      text: snackbarText2
    }]);
    await update(<SnackbarContainer />);
    expect(queryByText(snackbarText1)).toBeTruthy();
    expect(queryByText(snackbarText2)).toBeFalsy();
    jest.advanceTimersByTime(5000);
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'DEQUEUE_SNACKBAR'
    });
    // Simulate pop of snackbar from the redux store (triggered by DEQUEUE_SNACKBAR action)
    mockUseSelector.mockImplementation(() => []);
    await update(<SnackbarContainer />);
    expect(queryByText(snackbarText1)).toBeFalsy();
    expect(queryByText(snackbarText2)).toBeTruthy();
    jest.advanceTimersByTime(5000);
    expect(queryByText(snackbarText1)).toBeFalsy();
    expect(queryByText(snackbarText2)).toBeFalsy();
  });
});