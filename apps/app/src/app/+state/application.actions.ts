import { Action } from "@ngrx/store";
import { RequestConfig } from "@guavus/auth";


export const FETCH_USER_COUNT = '[Application] fetch user count';
export const FETCH_USER_COUNT_SUCCESS = '[Application] fetch user count success';
export const FETCH_USER_COUNT_FAIL = '[Application] fetch user count fail';

export class FetachUserCount implements Action {
  readonly type = FETCH_USER_COUNT;
  constructor(readonly config: RequestConfig) {
  }
}

export class FetachUserCountSuccess implements Action {
  readonly type = FETCH_USER_COUNT_SUCCESS;
  constructor(public userCount: number) {
  }
}


export class FetachUserCountFail implements Action {
  readonly type = FETCH_USER_COUNT_FAIL;

}


export type Actions = FetachUserCount | FetachUserCountSuccess | FetachUserCountFail;
