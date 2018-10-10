import { ActionReducerMap, MetaReducer} from "@ngrx/store";
//import { storeFreeze } from 'ngrx-store-freeze';
import { LoginState } from '@reflex-ide/login';
import { applicationReducer } from './application.reducer';
import { environment } from '../../environments/environment';
import { UserCountStatus } from "./application.init";

export interface ApplicationState {
   // define state here
   count:number,
   status:UserCountStatus,
}

export interface RootState {
  readonly application: ApplicationState;
  readonly login?: LoginState;
}

export const reducers:ActionReducerMap<RootState> = {
  application:applicationReducer
}


// storeFreeze prevents state from being mutated. When mutation occurs, an exception
// will be thrown. Only for development mode.
export const metaReducers: MetaReducer<RootState>[] = []//!environment.production ? [storeFreeze] : [];
