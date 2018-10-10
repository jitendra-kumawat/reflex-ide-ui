import { browser, by, element } from 'protractor';
import { LoginPage } from './login.po';

describe('Login page', () => {
  let page: LoginPage;

  beforeEach(() => {
    page = new LoginPage();
  });

  it('On login sucessfully , navigate to app', () => {
    page.navigateTo();
    page.fillCredentials();
    expect(page.getError().isPresent()).toBeFalsy();
    expect(browser.getCurrentUrl()).toContain('app');
  });
  it('On login with incorrect credentials , show error and stay on loginpage', () => {
    const wrongCredentias = {
      username: 'wrongname',
      password: 'wrongpasswd'
    }
    page.navigateTo();
    page.fillCredentials(wrongCredentias);
    expect(browser.getCurrentUrl()).toContain('login');
    expect(page.getError().isDisplayed()).toBeTruthy();
    expect(page.getError().getText()).toEqual('Enter valid Credentials');

  });
});
