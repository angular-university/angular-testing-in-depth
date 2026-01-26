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
});