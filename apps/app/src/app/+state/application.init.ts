import { ApplicationState } from './application.interfaces';

export enum UserCountStatus {
  INPROGRESS,
  SUCCESSFULL,
  FAILURE,
}


export const applicationInitialState: ApplicationState = {
  // fill it initial state here
  count: undefined,
  status:undefined,
};


