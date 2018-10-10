import { applicationReducer } from './application.reducer';
import { applicationInitialState, UserCountStatus } from './application.init';
import { ApplicationState } from './application.interfaces';
import * as ApplicationActions from './application.actions';

describe('applicationReducer', () => {
  it('should work', () => {
    const state: ApplicationState = applicationInitialState;
    const action: ApplicationActions.FetachUserCount = { type: ApplicationActions.FETCH_USER_COUNT, config:{url:"", headers: {}, payload:""} };
    const actual = applicationReducer(state, action);

    const stateInProgress: ApplicationState = { count: applicationInitialState.count, status:UserCountStatus.INPROGRESS };

    expect(actual).toEqual(stateInProgress);
  });
});
