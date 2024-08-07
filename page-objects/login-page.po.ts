import { expect, type Locator, type Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly loginHeader: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly forgotPasswordBtn: Locator;
  readonly signUpBtn: Locator;
  readonly submitBtn: Locator;
  readonly errorAlert: Locator;
  readonly errorText =
    "The username or password provided in the request are invalid.";

  constructor(page: Page) {
    this.page = page;
    this.loginHeader = page.getByText("Log in to Maltego");
    this.emailInput = page.getByTestId("signInName");
    this.passwordInput = page.getByTestId("password");
    this.forgotPasswordBtn = page.getByTestId("forgotPassword");
    this.signUpBtn = page.getByTestId("createAccount");
    this.submitBtn = page.getByTestId("next");
    this.errorAlert = page.getByRole("alert");
  }

  // navigate to the sign up page
  async goToSignUpPage() {
    await this.signUpBtn.click();
  }

  // navigate to the forgot password page
  async goToForgotPasswordPage() {
    await this.forgotPasswordBtn.click();
  }

  // login
  async login(emailAddress: string, password: string) {
    // fill up the login fields
    await this.emailInput.fill(emailAddress);
    await this.passwordInput.fill(password);

    // submit
    await this.submitBtn.click();
  }

  // verify that the login page is displayed
  async verifyLoginPage() {
    await expect(this.loginHeader).toBeVisible({ timeout: 10000 });
  }

  // verify that an error alert is displayed
  async verifyErrorAlert() {
    await expect(this.errorAlert).toHaveText(this.errorText, {
      timeout: 10000,
    });
  }
}
