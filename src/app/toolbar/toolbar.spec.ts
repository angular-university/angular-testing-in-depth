import { TestBed } from '@angular/core/testing';
import { Toolbar } from './toolbar';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { Component } from '@angular/core';

@Component({ standalone: true, template: '' })
class DummyComponent { }

describe('Toolbar', () => {
  let harness: RouterTestingHarness;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toolbar],
      providers: [
        provideRouter([
          { path: 'courses', component: DummyComponent },
          { path: 'about', component: DummyComponent }
        ])
      ]
    }).compileComponents();
    harness = await RouterTestingHarness.create();
  });

  it('should show the active class on the toolbar link', async () => {

    const fixture = TestBed.createComponent(Toolbar);
    const hostElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();

    await harness.navigateByUrl('/courses');

    fixture.detectChanges();

    const activeLink = hostElement.querySelector('.active-link');

    expect(activeLink).toBeTruthy();
    expect(activeLink?.textContent).toContain('Courses');
  });
});