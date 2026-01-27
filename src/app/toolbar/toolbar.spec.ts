import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { Toolbar } from './toolbar';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { By } from '@angular/platform-browser';


@Component({
  selector: 'courses',
  template: '<h1>Courses Page</h1>',
})
class MockCourses { }
@Component({
  selector: 'about-us',
  template: '<h1>About Page</h1>',
})
class MockAbout { }

describe('Toolbar', () => {
  let harness: RouterTestingHarness;
  let component: Toolbar;
  let fixture: ComponentFixture<Toolbar>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toolbar],
      providers: [
        provideRouter([
          { path: '', component: MockCourses },
          { path: 'courses', component: MockCourses },
          { path: 'about', component: MockAbout },
        ]),
      ],
    });
    fixture = TestBed.createComponent(Toolbar);
    component = fixture.componentInstance;
    harness = await RouterTestingHarness.create();
  });

  it('should display courses component for default route', async () => {
    await harness.navigateByUrl('');
    expect(harness.routeNativeElement?.textContent).toContain('Courses Page');
  });

  it('should display about component for about route', async () => {
    await harness.navigateByUrl('/about');
    expect(harness.routeNativeElement?.textContent).toContain('About Page');
  });

  it('should update signal and emit output when select is called', async () => {
    const emitSpy = vi.spyOn(component.tabChanged, 'emit');
    component.select('about');

    expect(component.activeTab()).toBe('about');
    expect(emitSpy).toHaveBeenCalledWith('about');
  });
  
  it('should have "courses" as the initial active tab', () => {
    console.log('component.activeTab()',component.activeTab())
    expect(component.activeTab()).toBe('courses');
  });

});