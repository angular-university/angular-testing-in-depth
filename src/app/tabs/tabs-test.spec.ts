import {beforeEach, describe, expect, it, vi} from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TabsComponent} from './tabs';
import {DebugElement} from '@angular/core';
import {TabData} from './tabs.model';
import {MOCK_TABS} from '../testing/testing-data';
import {By} from '@angular/platform-browser';

describe("Tabs custom tests",()=>{
  let fixture:ComponentFixture<TabsComponent>
  let debugElement:DebugElement;
  let component:TabsComponent;
  const mockedTabs:TabData[] = MOCK_TABS

  beforeEach(async ()=>{
    await TestBed.configureTestingModule({
      imports:[TabsComponent]
    }).compileComponents()
    fixture = TestBed.createComponent(TabsComponent)
    debugElement= fixture.debugElement
    component = fixture.componentInstance;
    fixture.componentRef.setInput("tabs",mockedTabs)
    fixture.detectChanges()
  })

  it("it should create tab component",()=>{
    expect(component).toBeDefined()
  })

  it("it should render 2 button tabs",()=>{
    const buttonEl= debugElement.queryAll(By.css(".tab-link"));
    expect(buttonEl.length).toEqual(2)
    expect(buttonEl[0].nativeElement.textContent.trim()).toEqual("Beginner")
    expect(buttonEl[1].nativeElement.textContent.trim()).toEqual("Advanced")
  })

  it("it should have active class when clicked",()=>{
    fixture.componentRef.setInput("activeTab","advanced")
    fixture.detectChanges()
    const button = debugElement.query(By.css(".tab-link:last-child"))
    expect(component.activeTab()).toEqual("advanced")
  })

  it("it should emit tab changed when clicked",()=>{
    const emitSpy = vi.spyOn(component.tabChanged,"emit")
    const button = debugElement.query(By.css(".tab-link:last-child"))
    button.nativeElement.click()
    fixture.detectChanges()
    expect(emitSpy).toHaveBeenCalledWith("advanced")
    expect(emitSpy).toHaveBeenCalledOnce()
  })
})
