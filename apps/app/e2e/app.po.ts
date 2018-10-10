import { browser, by, element } from 'protractor';

export class AppPage {
  title = 'Seed Application';
  login_route='login';
  navigateTo() {
    return browser.get('/');
  }

  getLoginPage() {
    return element(by.tagName('login-page')).getTagName();
  }
  text() {
    return browser.findElement(by.css('body')).getText();
  }
}
