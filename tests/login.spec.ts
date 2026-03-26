import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import users from '../test-data/qa/Users.json'


test.describe('Login functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('Successful login', async ({ page }) => {
    await loginPage.userLogin(users.validUser.username, users.validUser.password);

    await expect(page).toHaveURL(/inventory/);
  });

  test('Validate error message with incorrect user', async ({ page }) => {
    await loginPage.userLogin(users.invalidUser.username, users.invalidUser.password);
   
    const error = loginPage.getErrorMessage();

    await expect(error).toBeVisible();
    await expect(error).toContainText('Epic sadface: Username and password do not match any user in this service');
  });

  test('Empty fields show validation error', async ({ page }) => {
    await loginPage.userLogin('', '');

    const error = loginPage.getErrorMessage();

    await expect(error).toBeVisible();
    await expect(error).toContainText('Epic sadface: Username is required');
  });

  test('Empty username field show validation error', async ({ page }) => {
    await loginPage.userLogin('', users.validUser.password);

    const error = loginPage.getErrorMessage();

    await expect(error).toBeVisible();
    await expect(error).toContainText('Epic sadface: Username is required');
  });

  test('Empty password field show validation error', async ({ page }) => {
    await loginPage.userLogin(users.validUser.username, '');

    const error = loginPage.getErrorMessage();

    await expect(error).toBeVisible();
    await expect(error).toContainText('Epic sadface: Password is required');
  });

  test('Locked-out user cannot login', async ({ page }) => {

    await loginPage.userLogin(users.locked_user.username, users.locked_user.password);

    const error = loginPage.getErrorMessage();

    await expect(error).toBeVisible();
    await expect(error).toContainText('Epic sadface: Sorry, this user has been locked out.');
  });

  test('Unregistered user cannot login', async ({ page }) => {

    await loginPage.userLogin(users.unregister_user.username, users.unregister_user.password); 

    const error = loginPage.getErrorMessage();

    await expect(error).toBeVisible();
    await expect(error).toContainText('Epic sadface: Username and password do not match any user in this service');
  });

  // Validate that login does not trim whitespace from credentials
  test('Login fails when credentials contain leading/trailing spaces', async ({ page }) => {
    await loginPage.userLogin(users.trimming_user.username, users.trimming_user.password);

    const error = loginPage.getErrorMessage();

    await expect(error).toBeVisible();
    await expect(error).toContainText('Epic sadface: Username and password do not match any user in this service');
  });
});