require("dotenv").config({ path: ".env.test" });
const { Builder, By, Key, until } = require("selenium-webdriver");
const fs = require("fs");

(async function runTest() {
  const EMAIL = process.env.CLERK_EMAIL;
  const PASSWORD = process.env.CLERK_PASSWORD;
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.manage().window().maximize();
    await driver
      .manage()
      .setTimeouts({ implicit: 10000, pageLoad: 30000, script: 30000 });

    await driver.get("http://localhost:5173/auth");
    await driver.sleep(500);
    await waitForPageReady(driver);

    await handleClerkAuth(driver, EMAIL, PASSWORD);
    await driver.sleep(500);

    await driver.wait(until.urlIs("http://localhost:5173/"), 20000);
    await driver.get("http://localhost:5173/income");
    await driver.sleep(500);
    await waitForPageReady(driver);

    await submitIncomeForm(driver);
    await driver.sleep(500);

    await submitBudgetForm(driver);
    await driver.sleep(500);

    //per me na kthy apet te faqja kryesore dashboardi-i e kena veq http://localhost:5173/
    await driver.get("http://localhost:5173/");
    await driver.sleep(500);
    await waitForPageReady(driver);

    await submitFinancialRecord(driver);
    await driver.sleep(500);

    console.log("✅ Test completed successfully!");
  } catch (err) {
    console.error("❌ Test failed:", err.message);
    await takeScreenshot(driver, "error.png");
  } finally {
    await driver.quit();
  }
})();

async function waitForPageReady(driver) {
  await driver.wait(
    () => driver.executeScript('return document.readyState === "complete"'),
    15000
  );
  await driver.sleep(500);
}

async function handleClerkAuth(driver, email, password) {
  const signInBtn = await retryElementInteraction(
    driver,
    [
      By.xpath("//button[contains(.,'Sign in')]"),
      By.css('button[data-testid="sign-in-button"]'),
      By.css("button.cl-sign-in-button"),
    ],
    5
  );
  await signInBtn.click();
  await driver.sleep(500);

  const emailInput = await retryElementInteraction(
    driver,
    [By.name("identifier"), By.css('input[type="email"]')],
    3
  );
  for (const char of email) {
    await emailInput.sendKeys(char);
    await driver.sleep(100); // slow typing email
  }
  await emailInput.sendKeys(Key.RETURN);
  await driver.sleep(500);

  const passwordInput = await retryElementInteraction(
    driver,
    [By.name("password"), By.css('input[type="password"]')],
    3
  );
  for (const char of password) {
    await passwordInput.sendKeys(char);
    await driver.sleep(100); // slow typing password
  }
  await passwordInput.sendKeys(Key.RETURN);
  await driver.sleep(500);
}

async function submitIncomeForm(driver) {
  await driver.wait(until.elementLocated(By.css("form")), 10000);
  await driver.sleep(500);

  const sourceInput = await retryElementInteraction(
    driver,
    [
      By.xpath("//label[contains(.,'Source')]/following-sibling::input"),
      By.css("input.input:first-of-type"),
    ],
    5
  );
  await sourceInput.clear();
  await driver.sleep(300);
  await sourceInput.sendKeys("Test Job");
  await driver.sleep(500);

  const amountInput = await retryElementInteraction(
    driver,
    [
      By.xpath("//label[contains(.,'Amount')]/following-sibling::input"),
      By.css('input.input[type="number"]'),
    ],
    5
  );
  await amountInput.clear();
  await driver.sleep(300);
  await amountInput.sendKeys("999");
  await driver.sleep(500);

  await submitForm(driver, "Add Income");
  await driver.sleep(500);
}

async function submitBudgetForm(driver) {
  await driver.get("http://localhost:5173/budgets");
  await waitForPageReady(driver);

  const categoryInput = await retryElementInteraction(
    driver,
    [
      By.xpath("//label[contains(.,'Category')]/following-sibling::input"),
      By.css("input.input:first-of-type"),
    ],
    5
  );
  await categoryInput.clear();
  await driver.sleep(300);
  await categoryInput.sendKeys("Clothes");
  await driver.sleep(500);

  const limitInput = await retryElementInteraction(
    driver,
    [
      By.xpath("//label[contains(.,'Monthly Limit')]/following-sibling::input"),
      By.css('input.input[type="number"]'),
    ],
    5
  );
  await limitInput.clear();
  await driver.sleep(300);
  await limitInput.sendKeys("500");
  await driver.sleep(500);

  await submitForm(driver, "Add Budget");
  await driver.sleep(500);
}

async function submitFinancialRecord(driver) {
  const descInput = await retryElementInteraction(
    driver,
    [
      By.xpath("//label[contains(.,'Description')]/following-sibling::input"),
      By.css("input.input[type='text']"),
    ],
    5
  );
  await descInput.clear();
  await descInput.sendKeys("Albania tshirt");
  await driver.sleep(500);

  const amountInput = await retryElementInteraction(
    driver,
    [
      By.xpath("//label[contains(.,'Amount')]/following-sibling::input"),
      By.css("input.input[type='number']"),
    ],
    5
  );
  await amountInput.clear();
  await amountInput.sendKeys("50");
  await driver.sleep(500);

  const categoryDropdown = await retryElementInteraction(
    driver,
    [By.xpath("//label[contains(.,'Category')]/following-sibling::select")],
    5
  );
  await categoryDropdown.sendKeys("Clothes");
  await driver.sleep(500);

  const paymentDropdown = await retryElementInteraction(
    driver,
    [
      By.xpath(
        "//label[contains(.,'Payment Method')]/following-sibling::select"
      ),
    ],
    5
  );
  await paymentDropdown.sendKeys("Crypto Payment");
  await driver.sleep(500);

  await submitForm(driver, "Add Record");
  await driver.sleep(500);
}

async function submitForm(driver, buttonText) {
  const submitBtn = await retryElementInteraction(
    driver,
    [
      By.xpath(`//button[contains(., '${buttonText}')]`),
      By.css('button.button[type="submit"]'),
    ],
    5
  );

  try {
    await submitBtn.click();
  } catch {
    await driver.executeScript("arguments[0].click();", submitBtn);
  }
  await driver.sleep(500);
}

async function retryElementInteraction(driver, locators, attempts) {
  for (let i = 0; i < attempts; i++) {
    for (const locator of locators) {
      try {
        const element = await driver.wait(until.elementLocated(locator), 10000);
        await driver.wait(until.elementIsVisible(element), 5000);
        await driver.wait(until.elementIsEnabled(element), 5000);
        return element;
      } catch {}
    }
    await driver.sleep(1000);
  }
  throw new Error(`All locators failed after ${attempts} attempts`);
}

async function takeScreenshot(driver, filename) {
  const image = await driver.takeScreenshot();
  fs.writeFileSync(filename, image, "base64");
}
