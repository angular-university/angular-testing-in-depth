import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HelloWorld} from './hello-world';

import {beforeEach, describe, it, expect} from 'vitest';
import {DebugElement} from '@angular/core';

describe('HelloWorld', () => {
  let component: HelloWorld;
  let fixture: ComponentFixture<HelloWorld>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelloWorld]
    }).compileComponents();

    fixture = TestBed.createComponent(HelloWorld);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should display message', async () => {

    const h1 = el.querySelector("h1")!;
    expect(h1).toBeDefined();
    expect(h1.textContent).toEqual(component.message);

  });

});
