import { createSelector } from '@ngrx/store';

import { applicationInitialState, UserCountStatus } from './application.init';
import { ApplicationState, RootState } from './application.interfaces';
import * as ApplicationActions from '../+state/application.actions';


export function applicationReducer(state: ApplicationState = applicationInitialState, action: ApplicationActions.Actions): ApplicationState {
  switch (action.type) {
    case ApplicationActions.FETCH_USER_COUNT: {
      return { ...state, status:UserCountStatus.INPROGRESS };
    }
    case ApplicationActions.FETCH_USER_COUNT_SUCCESS: {
      return { ...state, status:UserCountStatus.SUCCESSFULL, count:action.userCount  };
    }
    case ApplicationActions.FETCH_USER_COUNT_FAIL: {
      return { ...state, status:UserCountStatus.FAILURE };
    }
    default: {
      return state;
    }
  }
}

//parent state selector
export const getRootStateSelector = (state: RootState) => state?state:null;

// application state selector
export const getApplicationStateSelector = createSelector(getRootStateSelector ,(state:RootState) => state?state.application:null )

export const getUserCountSelector = createSelector(getApplicationStateSelector,  ( state : ApplicationState) => state.count);
export const getUserCountStatusSelector = createSelector(getApplicationStateSelector,  ( state : ApplicationState) => state.status);
