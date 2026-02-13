import {describe, expect, it} from 'vitest';
import {ComponentFixture} from '@angular/core/testing';
import {TabsComponent} from '../tabs/tabs';
import {TabData} from '../tabs/tabs.model';
import {MOCK_TABS} from '../testing/testing-data';


describe("TabsComponent", () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;
  const mockTabs: TabData[] = MOCK_TABS;

  it("should create tabs component", () => {

  })

  it("should render the correct number of tab buttons", () => {

  })

  it("should apply the active class to the selected tab", () => {

  })

  it("should emit tabChanged when a new tab is clicked", () => {

  })

  it("should emit activeTab model when a new tab is clicked", () => {

  })

  it("should select the right tab when activeTab changes", () => {

  })

})
