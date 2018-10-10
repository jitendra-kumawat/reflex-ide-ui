import { InjectionToken } from "@angular/core";

export interface ErrorMessages {
  [key: string]: string;
}

export const ERROR_MESSAGES = new InjectionToken<ErrorMessages>('ERROR_MESSAGES')
