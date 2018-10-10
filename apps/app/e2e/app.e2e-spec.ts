import { browser, by, element } from 'protractor';
import { AppPage } from './app.po';
import { LoginPage } from './login.po';

describe('app App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
  });

  it('App should navigate to login page', () => {
    expect(browser.getCurrentUrl()).toContain(page.login_route);
    expect(page.getLoginPage()).toEqual('login-page');
  });

  it('App should have title "Seed Application" ', () => {
    expect(browser.getTitle()).toEqual(page.title);
  });
});
