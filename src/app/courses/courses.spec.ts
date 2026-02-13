import {beforeEach, describe, expect, it} from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TabsComponent} from '../tabs/tabs';
import {TabData} from '../tabs/tabs.model';
import {MOCK_TABS} from '../testing/testing-data';

describe("TabsComponent", () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;
  const mockTabs: TabData[] = MOCK_TABS;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("tabs", mockTabs);
    fixture.detectChanges();
  })

  it("should create the tabs component", () => {
    expect(component).toBeDefined();
  })

})
