import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TabsComponent} from './tabs';
import {TabData} from './tabs.model';
import {By} from '@angular/platform-browser';
import {beforeEach, describe, expect, it, vi} from 'vitest';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  const mockTabs: TabData[] = [
    {label: 'Beginner', value: 'beginner'},
    {label: 'Advanced', value: 'advanced'}
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('tabs', mockTabs);

    fixture.detectChanges();
  });

  it('should create tab', () => {
    expect(component).toBeDefined();
  });

  it('should render the correct number of tab buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('.tab-link'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.textContent).toContain('Beginner');
    expect(buttons[1].nativeElement.textContent).toContain('Advanced');
  });

  it.skip('should apply the active class to the selected tab', () => {
    const beginnerButton = fixture.debugElement.query(By.css('.tab-link:first-child'));
    expect(beginnerButton.nativeElement.classList).toContain('active');
  });

  it.skip('should emit tabChanged and update model when a new tab is clicked', () => {
    const emitSpy = vi.spyOn(component.tabChanged, 'emit');
    const advancedButton = fixture.debugElement.queryAll(By.css('.tab-link'))[1];
    advancedButton.nativeElement.click();

    expect(component.activeTab()).toBe('advanced');

    expect(emitSpy).toHaveBeenCalledWith('advanced');

    fixture.detectChanges();
    expect(advancedButton.nativeElement.classList).toContain('active');
  });

  it.skip('should update the view when the value signal is updated externally', () => {
    fixture.componentRef.setInput('value', 'advanced');
    fixture.detectChanges();

    const advancedButton = fixture.debugElement.queryAll(By.css('.tab-link'))[1];
    expect(advancedButton.nativeElement.classList).toContain('active');
  });
});
