import puppeteer from "puppeteer";

export class Browser {
  url;
  browser;
  page;
  constructor(url) {
    this.url = url;
  }
  async createBrowser() {
    this.browser = await puppeteer.launch({ headless: false });
    this.page = await this.browser.newPage();
  }
  async goToPage() {
    if (!this.page) {
      throw new Error("enter the url");
    } else {
      await this.page.goto(this.url);
    }
  }
  async stopBrowser() {
    await this.browser.close();
  }
  async start() {
    await this.createBrowser();
    await this.goToPage();
  }
}
