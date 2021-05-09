import startFetchAction, { startFetchActionName } from "../startFetchAction";
import { Payload } from "api-client";
import lolex from "lolex";
describe('startFetchAction', () => {
  let clock;
  const mockedTime = 0;
  beforeEach(() => {
    clock = lolex.install({
      now: mockedTime,
      toFake: []
    });
  });
  afterEach(() => {
    clock.uninstall();
  });
  it('should have the right action name', () => {
    expect(startFetchActionName('endpoint')).toBe('START_FETCH_ENDPOINT');
  });
  it('should create the right action', () => {
    expect(startFetchAction('endpoint', 'http://some.com/url')).toEqual({
      type: startFetchActionName('endpoint'),
      payload: new Payload(true, 'http://some.com/url')
    });
  });
});