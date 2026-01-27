import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TabsComponent } from './tabs'; 
import { TabsHarness } from './tabs.harness'; 
import { MOCK_TABS } from '../testing/test-data';
import { describe, expect, it, beforeEach } from 'vitest';

describe('TabsComponent with External Harness', () => {
  let harness: TabsHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(TabsComponent);
    
    fixture.componentRef.setInput('tabs', MOCK_TABS);
    fixture.componentRef.setInput('activeTab', MOCK_TABS[0].value);
    
    harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, TabsHarness);
    
    fixture.detectChanges();
  });

  it('should show the labels from mock data', async () => {
    const labels = await harness.getTabLabels();
    expect(labels[0]).toBe(MOCK_TABS[0].label);
  });

  it('should verify if a tab is active', async () => {
    const isActive = await harness.isTabActive(MOCK_TABS[0].label);
    expect(isActive).toBe(true);

    const isInactive = await harness.isTabActive(MOCK_TABS[1].label);
    expect(isInactive).toBe(false);

    const nonExistent = await harness.isTabActive('Ghost Tab');
    expect(nonExistent).toBe(false);
  });

  it('should select a tab by label', async () => {
    await harness.selectTabByLabel(MOCK_TABS[1].label);
    
    const isActive = await harness.isTabActive(MOCK_TABS[1].label);
    expect(isActive).toBe(true);
  });

  it('should throw error when selecting non-existent tab', async () => {
    await expect(harness.selectTabByLabel('Non Existent'))
      .rejects.toThrow('Tab with label "Non Existent" not found.');
  });
});