import { Page } from "@playwright/test";

export class LoginPage{
    constructor(private page: Page){}

    async navigate(){
        await this.page.goto('https://www.saucedemo.com/');
    }

    async userLogin(username: string, password: string) {
    await this.page.fill('#user-name', username);
    await this.page.fill('#password', password);
    await this.page.click('#login-button');
  }

  getErrorMessage() {
  return this.page.locator('[data-test="error"]');
}
}