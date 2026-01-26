import { ComponentHarness } from '@angular/cdk/testing';

export class TabsHarness extends ComponentHarness {
  static hostSelector = 'tabs';

  private tabs = this.locatorForAll('.tab-link');

  async getTabLabels(): Promise<string[]> {
    const tabs = await this.tabs();
    return Promise.all(tabs.map((tab) => tab.text()));
  }

  async selectTabByLabel(label: string): Promise<void> {
    const tabs = await this.tabs();
    for (const tab of tabs) {
      if ((await tab.text()) === label) {
        await tab.click();
        return;
      }
    }
    throw new Error(`Tab with label "${label}" not found.`);
  }

  async isTabActive(label: string): Promise<boolean> {
    const tabs = await this.tabs();
    for (const tab of tabs) {
      if ((await tab.text()) === label) {
        return await tab.hasClass('active');
      }
    }
    return false;
  }
}