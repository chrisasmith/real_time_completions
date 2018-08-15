import {E2EUtils} from '../e2e-util';
import {HomePage} from './home.po';
import {browser} from 'protractor';

describe('rtc App', () => {
  let page: HomePage;

  beforeEach(async () => {
    page = new HomePage();
    await page.navigateTo();
    E2EUtils.disableCSSAnimations();
  });

  it('should display welcome message', () => {
    expect(page.getMainText()).toEqual('Welcome To Real Time Completions');
  });

  it('should have an asset selection dropdown', () => {
    expect(page.assetDropdown.isPresent()).toBeTruthy();
  });

  it('should have Asset: as its label', () => {
    expect(page.getAssetDropdownLabel()).toEqual('Asset:');
  });

  it('should hide asset selection and show dashboard when asset is selected', async() => {
    await page.openAssetDropdown();
    await page.selectDelawareBasin();
    expect(page.homeDashboard.isPresent()).toBeTruthy();
    expect(page.welcomeScreen.isPresent()).toBeFalsy();
  });

  it('should change the asset in the navbar when its changed in the welcome screen', async() => {
    await page.openAssetDropdown();
    await page.selectDelawareBasin();
    expect(page.getNavAssetDropdownSelectedAsset()).toEqual(page.selectedAssetName);
  });

  it('should have a well count graph on the dashboard', () => {
    page.goToDashboard();
    expect(page.wellCountChart.isPresent()).toBeTruthy();
  });

  it('should have a stage count graph on the dashboard', () => {
    page.goToDashboard();
    expect(page.stageCountChart.isPresent()).toBeTruthy();
  });

  it('should have a map of the wells on the dashboard', () => {
    page.goToDashboard();
    expect(page.wellMap.isPresent()).toBeTruthy();
  });

  it('should show year to date wells', () => {
    page.goToDashboard();
    expect(page.ytdWellsKPICard.isPresent()).toBeTruthy();
  });

  it('should show year to date stages', () => {
    page.goToDashboard();
    expect(page.ytdStagesKPICard.isPresent()).toBeTruthy();
  });

  it('should navigate to treatment plot when a well is clicked on the dashboard map', async () => {
    /*await page.goToDashboard();
    await page.clickFirstWellOnMap();
    browser.pause();
    browser.sleep(10000);
    expect(page.ytdStagesKPICard.isPresent()).toBeFalsy();*/
  });
});


