import { Browser } from "./Browser.js";

export class HackathonPage extends Browser {
  email;
  password;
  constructor(url, email, password) {
    super(url);
    this.email = email;
    this.password = password;
  }
  async login() {
    // open the page of a website
    await this.goToPage();

    // path to the inputs
    const mb3Elements = await this.page.$$(
      ".container .col-md-6 form .mb-3 input"
    );
    // input a login
    await this.page.evaluate(
      (input, email) => {
        input.value = email;
      },
      mb3Elements[0],
      this.email
    );

    // input a login
    await this.page.evaluate(
      (input, password) => {
        input.value = password;
      },
      mb3Elements[1],
      this.password
    );
    // submit the login button
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: "load" }),
      this.page.click(".container .col-md-6 form button[type='submit']"),
    ]);
  }
  async inputParameters(values) {
    await this.page.evaluate(values => {
      document.getElementById("x1").value = values.Speed;
      document.getElementById("x2").value = values.Load;
      document.getElementById("x3").value = values.Railpressure;
      document.getElementById("x4").value = values.Air;
      document.getElementById("x5").value = values.CrankAngle;
      document.getElementById("x6").value = values.Intakepressure;
      document.getElementById("x7").value = values.Backpressure;
      document.getElementById("x8").value = values.Intaketemperature;
    }, values);
  }
  async submit() {
    await this.page.click(".container form button[type='submit']");
  }
  async waitForElement(selector, timeout) {
    try {
      await this.page.waitForFunction(
        selector =>
          document.querySelector(selector)?.textContent?.trim() !== "",
        { timeout },
        selector
      );
      return true;
    } catch (error) {
      return false;
    }
  }
  async getResults() {
    const selector = ".container .result-box";
    const check = await this.waitForElement(selector, 20000);
    if (check) {
      const results = await this.page.$eval(selector, results => {
        const dataText = results.textContent.trim();
        return dataText.replace("[", "").replace("]", "").split(",");
      });
      return results;
    } else {
      throw new Error("the result wasn`t inmounted");
    }
  }
}
