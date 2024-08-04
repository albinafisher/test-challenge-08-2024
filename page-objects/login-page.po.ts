import { type Locator, type Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly forgotPasswordBtn: Locator;
  readonly signUpBtn: Locator;
  readonly submitBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId("signInName");
    this.passwordInput = page.getByTestId("password");
    this.forgotPasswordBtn = page.getByTestId("forgotPassword");
    this.signUpBtn = page.getByTestId("createAccount");
    this.submitBtn = page.getByTestId("next");
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
}
