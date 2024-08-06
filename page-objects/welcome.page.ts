import { expect, type Locator, type Page } from "@playwright/test";

export class WelcomePage {
  readonly page: Page;
  readonly logInButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logInButton = page.getByRole("button");
  }

  // navigate to the login page
  async goToLoginPage() {
    await this.logInButton.click();
  }

  // verify that the welcome page with the "Log In" button is displayed
  async verifyWelcomePage() {
    await expect(this.logInButton).toBeVisible({
      timeout: 10000,
    });
  }
}
