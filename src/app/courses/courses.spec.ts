import {beforeEach, describe, expect, it} from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TabsComponent} from '../tabs/tabs';
import {TabData} from '../tabs/tabs.model';
import {MOCK_TABS} from '../testing/testing-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

describe("TabsComponent", () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;
  let de: DebugElement;
  const mockTabs: TabData[] = MOCK_TABS;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.componentRef.setInput("tabs", mockTabs);
    fixture.detectChanges();
  })

  it("should create the tabs component", () => {
    expect(component).toBeDefined();
  })

  it("should render the correct number of tab buttons", () => {
    const buttons = de.queryAll(By.css(".tab-link"));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.textContent.trim()).toBe("Beginner");
    expect(buttons[1].nativeElement.textContent.trim()).toBe("Advanced");
  })

  it('should apply the active class to the selected tab', () => {
    fixture.componentRef.setInput("activeTab", "advanced");
    fixture.detectChanges();
    const button = de.query(By.css(".tab-link:last-child"));
    expect(button.nativeElement.classList).toContain("active");
  });

})
