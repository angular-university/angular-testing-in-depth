import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Courses } from './courses';
import { CoursesService } from '../services/courses.service';
import { By } from '@angular/platform-browser';
import { Course } from '../model/course';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { MOCK_COURSES } from '../testing/test-data';

describe('Courses Component Integration', () => {
  let component: Courses;
  let fixture: ComponentFixture<Courses>;
  let httpMock: HttpTestingController;
  let appRef: ApplicationRef;

  const mockCourses: Course[] = MOCK_COURSES

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Courses],
      providers: [
        CoursesService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Courses);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    appRef = TestBed.inject(ApplicationRef);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load courses via the resource and filter them by category', async () => {
    fixture.detectChanges();

    // 2. Resource effects are scheduled. We tick to trigger the HTTP request
    appRef.tick();

    // 3. Intercept the request from the real service
    const req = httpMock.expectOne('/api/courses'); // Adjust URL to your real endpoint
    req.flush({ payload: mockCourses });

    // 4. Wait for the Resource signal to update from 'loading' to 'resolved'
    await appRef.whenStable();
    fixture.detectChanges(); // Update the component UI with new signal values

    // Assertions
    expect(component.beginnerCourses()).toHaveLength(1);
    expect(component.advancedCourses()).toHaveLength(1);
    expect(component.beginnerCourses()[0].titles.description).toBe('Beginner Course');
  });

  it('should switch tabs and update the visible cards', async () => {
    fixture.detectChanges();
    appRef.tick();
    httpMock.expectOne('/api/courses').flush({ payload: mockCourses });
    await appRef.whenStable();
    fixture.detectChanges();

    const tabs = fixture.debugElement.queryAll(By.css('.tab-link'));
    tabs[1].nativeElement.click();
    fixture.detectChanges();

    expect(component.activeTab()).toBe('advanced');

    const cardList = fixture.debugElement.query(By.css('courses-card-list'));
    expect(cardList.componentInstance.courses()).toEqual(component.advancedCourses());
  });

  it('should show empty message when a category has no courses', async () => {
    fixture.detectChanges();
    appRef.tick();
    httpMock.expectOne('/api/courses').flush({ payload: [mockCourses[0]] });
    await appRef.whenStable();

    component.onTabChanged('advanced');
    fixture.detectChanges();

    const emptyMsg = fixture.nativeElement.querySelector('.empty-msg');
    expect(emptyMsg.textContent).toContain('No advanced courses available');
  });
});