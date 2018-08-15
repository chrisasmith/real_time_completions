import {browser, by, element, ElementFinder, promise} from 'protractor';

export class HomePage {
  welcomeScreen = element(by.css('div.welcome-screen'));
  homeDashboard = element(by.css('div.home-dashboard'));
  welcomeMsg = element(by.css('.floating-content-container h2.display-4'));
  title = element(by.css('.floating-content-container h1'));
  assetDropdown = element(by.css('.floating-content-container app-nav-dropdown'));
  navAssetDropdown = element(by.css('.app-navbar app-nav-dropdown'));
  wellCountChart = element.all(by.css('.monthly-graphs app-monthly-graph')).get(0);
  stageCountChart = element.all(by.css('.monthly-graphs app-monthly-graph')).get(1);
  wellMap = element(by.css('app-leaflet-map'));
  ytdWellsKPICard = element(by.css('app-data-card[title="YTD Wells"]'));
  ytdStagesKPICard = element(by.css('app-data-card[title="YTD Stages"]'));
  selectedAssetName: string;

  navigateTo() {
    return browser.get('/');
  }

  async getMainText(): promise.Promise<string> {
    const welcomeMsg = await this.welcomeMsg.getText();
    const title = await this.title.getText();
    return `${welcomeMsg} ${title}`;
  }

  async getAssetDropdownLabel(): promise.Promise<string> {
    return await this.assetDropdown.element(by.css('.wellbore-text')).getText();
  }

  async getNavAssetDropdownSelectedAsset(): promise.Promise<string> {
    return await this.navAssetDropdown.element(by.css('.dropdown-toggle')).getText();
  }

  async openAssetDropdown(): promise.Promise<any> {
    const ddButton = this.assetDropdown.element(by.css('.dropdown-toggle'));
    return await ddButton.click();
  }

  async selectDelawareBasin(): promise.Promise<any> {
    const ddMenuButton = this.assetDropdown.element(by.css('.dropdown-menu')).element(by.css('li button'));
    this.selectedAssetName = await ddMenuButton.getText();
    return await ddMenuButton.click();
  }

  async goToDashboard(): promise.Promise<any> {
    await this.openAssetDropdown();
    return await this.selectDelawareBasin();
  }

  async clickFirstWellOnMap(): promise.Promise<any> {
    // const firstVisibleWell = await element.all(by.css('.leaflet-interactive')).filter(el => el.isDisplayed()).get(0);
    // return await firstVisibleWell.click();
    // return await browser.actions().click(firstVisibleWell.getWebElement()).perform();
  }
}
