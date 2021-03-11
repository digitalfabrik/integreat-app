# Unit/Integration Testing

The goals of testing are the following with decreasing importance:

- Unit test all public functions and classes
- Unit test all components
- Unit test all containers
- Test the integration between HOCs and components
  ...

## Testing components which use Higher Order Components (HOCs)

### Unit tests

In this section we want to test the component Failure and FailureContainer:

```js
// Failure.js
class Failure extends React.Component<PropsType> {
  render() {
    const { t, errorMessage, tryAgain, theme } = this.props

    return (
      <ViewContainer>
        <IconContainer source={FailureIcon} />
        <Text>{errorMessage || t('generalError')}</Text>
        {tryAgain && (
          <Button
            testID='button-tryAgain'
            titleStyle={{ color: theme.colors.textColor }}
            buttonStyle={{ backgroundColor: theme.colors.themeColor, marginTop: 20 }}
            onPress={tryAgain}
            title={t('tryAgain')}
          />
        )}
      </ViewContainer>
    )
  }
}
```

```js
// FailureContainer.js
export default withTheme(withTranslation('error')(Failure))
```

The most important part is to test the specific units using `@testing-library/react-native` and `react-test-renderer`. The following test is for the `Failure` component.

```js
it('should not render a retry button if tryAgain is not passed', () => {
  const { queryByTestId } = render(<Failure theme={lightTheme} t={key => key} />)

  expect(queryByTestId('button-tryAgain')).toBeNull()
})
```

The unit test for the container works as follows:

```js
const rendered = TestRenderer.create(<FailureContainer />)

const instance = rendered.root.findByType(Failure)
expect(instance.props).toEqual({
  t: expect.anything(),
  theme: expect.anything()
})
```

To make this a real unit test the `Failure` component should be mocked using:

```js
jest.mock('../../components/Failure', () => jest.fn(props => null))
```

To make the tests simpler HOCs were mocked using:

```js
jest.mock('react-i18next')
```

For complex HOCs it is probably easier to use the real implementation (e.g. connect()).

### Integration tests

Apart from unit tests it can also be beneficial to test the integration between the component and the HOCs:

```js
const t = key => key
const tryAgain = () => {}

const { asJSON: asJSONFailure } = render(<Failure theme={lightTheme} tryAgain={tryAgain} t={t} />)
const { asJSON: asJSONFailureContainer } = render(<FailureContainer tryAgain={tryAgain} />)

expect(asJSONFailure()).toEqual(asJSONFailureContainer())
```

OR:

```js
import FailureContainer from '../FailureContainer'

const tryAgain = jest.fn()
const { getByTestId } = render(<FailureContainer tryAgain={tryAgain} />)
fireEvent.press(getByTestId('button-tryAgain'))
expect(tryAgain).toHaveBeenCalled()
```

The `Failure` component should not be mocked in this test!
