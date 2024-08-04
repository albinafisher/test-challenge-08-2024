import { type Locator, type Page } from "@playwright/test";

export class ForgotPasswordPage {
  readonly page: Page;
  readonly newPasswordInput: Locator;
  readonly confirmNewPasswordInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newPasswordInput = page.getByTestId("newPassword");
    this.confirmNewPasswordInput = page.getByTestId("reenterPassword");
  }

  // enter a new password
  async enterNewPassword(newPassword: string) {
    await this.newPasswordInput.fill(newPassword);
    await this.confirmNewPasswordInput.fill(newPassword);
  }
}
