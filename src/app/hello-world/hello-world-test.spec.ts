import {beforeEach, describe, expect,it} from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HelloWorld} from './hello-world';
import {DebugElement} from '@angular/core';

describe("Hello world",()=>{
  let fixture:ComponentFixture<HelloWorld>
  let debug:DebugElement;
  let el:HTMLElement;
  let component:HelloWorld;

  beforeEach(async ()=>{
    await TestBed.configureTestingModule({
      imports:[HelloWorld]
    }).compileComponents();
    fixture = TestBed.createComponent(HelloWorld);
    debug = fixture.debugElement;
    el = debug.nativeElement;
    component = fixture.componentInstance;
    fixture.detectChanges()
  })

  it("verify component creation",()=>{
    expect(component).toBeDefined();
  })

  it("verify dom message",()=>{
    let h1 = el.querySelector('h1');
    expect(h1).toBeDefined()
    expect(h1?.textContent).toEqual(component.message)
  })
})
