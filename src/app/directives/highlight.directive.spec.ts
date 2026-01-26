import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HighlightDirective } from './highlight.directive';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({
  standalone: true,
  imports: [HighlightDirective],
  template: `
    <div id="default-highlight" appHighlight>Default Color</div>
    <div id="custom-highlight" appHighlight highlightColor="rgb(0, 0, 255)">Custom Color</div>
    <div id="no-highlight">No Directive</div>
  `
})
class TestHostComponent {}

describe('HighlightDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let elementsWithDirective: any[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, HighlightDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges(); 

    elementsWithDirective = fixture.debugElement.queryAll(By.directive(HighlightDirective));
  });

  it('should have two highlighted elements', () => {
    expect(elementsWithDirective.length).toBe(2);
  });

it('should apply default color (green) when no input is provided', () => {
    const el = fixture.debugElement.query(By.css('#default-highlight')).nativeElement;
    
    el.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();

    const computedStyle = window.getComputedStyle(el);
    
    expect(computedStyle.backgroundColor).toBe('rgb(0, 128, 0)'); 
  });

  it('should apply custom color (blue) when input is provided', () => {
    const el = fixture.debugElement.query(By.css('#custom-highlight')).nativeElement;
    
    el.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    expect(el.style.backgroundColor).toBe('rgb(0, 0, 255)');
  });

  it('should not affect elements without the directive', () => {
    const el = fixture.debugElement.query(By.css('#no-highlight')).nativeElement;
    
    el.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    expect(el.style.backgroundColor).toBe('');
  });
});