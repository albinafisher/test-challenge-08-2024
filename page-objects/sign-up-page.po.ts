import { type Locator, type Page } from "@playwright/test";

export class SignUpPage {
  readonly page: Page;
  readonly password: Locator;
  readonly reenterPassword: Locator;
  readonly givenName: Locator;
  readonly surname: Locator;
  readonly termsOfUseCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.password = page.getByTestId("newPassword");
    this.reenterPassword = page.getByTestId("reenterPassword");
    this.givenName = page.getByTestId("givenName");
    this.surname = page.getByTestId("surname");
    this.termsOfUseCheckbox = page.getByTestId(
      "extension_termsOfUseConsentChoice_AgreeToTermsOfUseConsentYes"
    );
  }

  // fill in the remaining fields
  async fillRemainingFields(
    password: string,
    givenName: string,
    surname: string
  ) {
    await this.password.fill(password);
    await this.reenterPassword.fill(password);
    await this.givenName.fill(givenName);
    await this.surname.fill(surname);
  }

  // agree to the terms of use
  async agreeToTermsOfUse() {
    await this.termsOfUseCheckbox.check();
  }
}
