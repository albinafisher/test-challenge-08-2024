require("dotenv").config();

import { test, expect } from "@playwright/test";
import MailSlurp from "mailslurp-client";
import { WelcomePage } from "../page-objects/welcome.page";
import { SignUpPage } from "../page-objects/sign-up-page.po";
import { LoginPage } from "../page-objects/login-page.po";
import { ProfilePage } from "../page-objects/profile-page.po";
import { ForgotPasswordPage } from "../page-objects/forgot-password.po";
import { VerificationPage } from "../page-objects/verification-page.po";
import { TwoFactorAuthenticationPage } from "../page-objects/two-factor-authentication-page.po";

test.describe("Auth tests", () => {
  let welcomePage: WelcomePage;
  let signUpPage: SignUpPage;
  let loginPage: LoginPage;
  let profilePage: ProfilePage;
  let forgotPasswordPage: ForgotPasswordPage;
  let verificationPage: VerificationPage;
  let twoFactorAuthenticationPage: TwoFactorAuthenticationPage;

  // retrieve and validate the API key from .env
  const apiKey = process.env.API_KEY as string;
  expect(apiKey).toBeDefined();

  // email addresses generator
  const mailslurp = new MailSlurp({ apiKey });

  test.beforeEach("initialize pages and open base URL", async ({ page }) => {
    welcomePage = new WelcomePage(page);
    signUpPage = new SignUpPage(page);
    loginPage = new LoginPage(page);
    profilePage = new ProfilePage(page);
    forgotPasswordPage = new ForgotPasswordPage(page);
    verificationPage = new VerificationPage(page);
    twoFactorAuthenticationPage = new TwoFactorAuthenticationPage(page);

    await page.goto("/");
  });

  test("should sign up successfully", async ({ page }) => {
    const password = "Test-Password-" + Date.now();
    const givenName = "Albina";
    const surname = "QA";

    // create a new inbox
    const { id, emailAddress } = await mailslurp.createInbox();

    await welcomePage.goToLoginPage();
    await loginPage.goToSignUpPage();

    await verificationPage.requestVerificationCode(emailAddress);
    const code = await verificationPage.extractVerificationCode(mailslurp, id);
    await verificationPage.enterVerificationCode(code);

    await signUpPage.fillRemainingFields(password, givenName, surname);
    await signUpPage.agreeToTermsOfUse();
    await verificationPage.continue();
    await twoFactorAuthenticationPage.selectStandardLogin(page);
    await profilePage.verifyProfilePage();
  });

  test("should login and logout successfully", async ({ page }) => {
    // existing email
    const emailAddress = "9650bb31-1538-4ebc-b387-47f92ae92f93@mailslurp.net";
    const password = "Test-Password-123";

    await welcomePage.goToLoginPage();
    await loginPage.login(emailAddress, password);
    await profilePage.verifyProfilePage();
    await profilePage.logout();
    await welcomePage.verifyWelcomePage();
  });

  test("should reset password and then login successfully", async ({
    page,
  }) => {
    // existing email
    const emailAddressID = "913cae6a-0027-4a69-8b8e-49d6b470c20f";
    const emailAddress = "913cae6a-0027-4a69-8b8e-49d6b470c20f@mailslurp.net";
    const newPassword = "Test-Password-NEW-" + Date.now();

    await welcomePage.goToLoginPage();
    await loginPage.goToForgotPasswordPage();

    await verificationPage.requestVerificationCode(emailAddress);
    const verificationCode = await verificationPage.extractVerificationCode(
      mailslurp,
      emailAddressID
    );
    await verificationPage.enterVerificationCode(verificationCode);

    await verificationPage.continue();
    await forgotPasswordPage.enterNewPassword(newPassword);
    await verificationPage.continue();
    await profilePage.verifyProfilePage();
  });

  [
    {
      emailAddress: "9650bb31-1538-4ebc-b387-47f92ae92f93-ERROR@mailslurp.net",
      password: "Test-Password-123",
      testName: "invalid login",
    },
    {
      emailAddress: "9650bb31-1538-4ebc-b387-47f92ae92f93@mailslurp.net",
      password: "Test-Password-" + Date.now(),
      testName: "invalid password",
    },
  ].forEach(({ emailAddress, password, testName }) => {
    test("should not login with " + testName, async ({ page }) => {
      await welcomePage.goToLoginPage();
      await loginPage.login(emailAddress, password);
      await loginPage.verifyErrorAlert();
    });
  });

  test.afterEach("close browser after running tests", async ({ page }) => {
    await page.close();
  });
});
