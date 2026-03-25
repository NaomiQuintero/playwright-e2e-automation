import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import users from '../test-data/qa/Users.json'


test.describe('Login functionality', () => {
  test('Successful login', async ({ page }) => {

    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.userLogin(users.validUser.username, users.validUser.password);

    await expect(page).toHaveURL(/inventory/);
  });

  test('Validate error message with incorrect user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.userLogin(users.invalidUser.username, users.invalidUser.password);

    await expect(loginPage.getErrorMessage()).toBeVisible();
    await expect(loginPage.getErrorMessage()).toContainText('Epic sadface: Username and password do not match any user in this service');
  });

});