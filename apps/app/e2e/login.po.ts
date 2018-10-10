import {
  browser,
  by,
  element,
  WebElement
  } from 'protractor';

export class LoginPage {

  private credentials = {
    username: 'admin',
    password: 'admin123'
  }

  navigateTo() {
    return browser.get('/login');
  }

  fillCredentials(credentias: any = this.credentials) {
    element(by.css('[formcontrolname="username"]')).sendKeys(credentias.username);
    element(by.css('[formcontrolname="password"]')).sendKeys(credentias.password);
    element(by.css('.gvs-login-button')).click();
  }

  getError() {
    return element(by.css('.gvs-error-message-wrapper > span'));
  }
}
