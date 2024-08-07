import { expect, type Locator, type Page } from "@playwright/test";
import MailSlurp from "mailslurp-client";

export class VerificationPage {
  readonly page: Page;
  readonly pageHeader: Locator;
  readonly successHeader: Locator;
  readonly emailAddressInput: Locator;
  readonly requestVerificationCodeBtn: Locator;
  readonly verificationCodeInput: Locator;
  readonly verifyCodeBtn: Locator;
  readonly continueBtn: Locator;
  readonly info: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeader = page.locator('[class="form-title"]');
    this.successHeader = page.locator('[id="email_success"]');
    this.emailAddressInput = page.getByTestId("email");
    this.requestVerificationCodeBtn = page.getByTestId("email_ver_but_send");
    this.verificationCodeInput = page.getByTestId("email_ver_input");
    this.verifyCodeBtn = page.getByTestId("email_ver_but_verify");
    this.continueBtn = page.getByTestId("continue");
    this.info = page.locator('[id="email_info"]');
  }

  // request a verification code
  async requestVerificationCode(emailAddress: string) {
    await this.emailAddressInput.fill(emailAddress);
    await this.requestVerificationCodeBtn.click();
    await expect(this.verifyCodeBtn).toBeVisible();
    await expect(this.info).toHaveText(
      "Verification code has been sent to your inbox. Please copy it to the input box below."
    );
  }

  // extract the verification code
  async extractVerificationCode(
    mailslurp: MailSlurp,
    emailAddressID: string
  ): Promise<string> {
    // regex for "Your code is: 123456"
    const regex: RegExp = /Your code is:\s*(\d{6})/;

    // extract the verification code from the latest email
    const email = await mailslurp.waitForLatestEmail(
      emailAddressID,
      30000,
      true
    );
    const emailBody = email.body ?? "";
    const match = regex.exec(emailBody) ?? "";
    const verificationCode: string = match[0].slice(-6);

    return verificationCode;
  }

  // enter the verification code
  async enterVerificationCode(verificationCode: string) {
    await this.verificationCodeInput.fill(verificationCode);
    await this.verifyCodeBtn.click();
  }

  // continue
  async continue() {
    await this.continueBtn.click();
  }

  // verify that the verification page is displayed
  async verifyVerificationPage(pageHeaderText: string) {
    await expect(this.pageHeader).toHaveText(pageHeaderText);
    await expect(this.requestVerificationCodeBtn).toBeVisible();
  }

  // verify that the verification success alert is displayed
  async verifyVerificationSuccess() {
    await expect(this.successHeader).toHaveText(
      "E-mail address verified. You can now continue."
    );
  }
}
