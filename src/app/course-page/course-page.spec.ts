import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursePage } from './course-page';
import { CoursesService } from '../services/courses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MOCK_COURSES, MOCK_LESSONS } from '../testing/test-data';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

describe('CoursePage', () => {
  let component: CoursePage;
  let fixture: ComponentFixture<CoursePage>;
  let mockCoursesService: any;
  let mockRouter: any;
  let appRef: ApplicationRef;

  const mockCourse = MOCK_COURSES[0];
  const mockLessons = MOCK_LESSONS;

  beforeEach(async () => {
    mockCoursesService = {
      findLessons: vi.fn().mockResolvedValue(mockLessons)
    };
    mockRouter = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [CoursePage],
      providers: [
        { provide: CoursesService, useValue: mockCoursesService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { course: mockCourse } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursePage);
    component = fixture.componentInstance;
    appRef = TestBed.inject(ApplicationRef);
  });

  it('should load lessons on init using resource', async () => {
    fixture.detectChanges(); 
    
    appRef.tick(); 
    
    await appRef.whenStable();
    
    fixture.detectChanges();

    expect(mockCoursesService.findLessons).toHaveBeenCalledWith(1, '', 'asc', 0, 3);
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);
  });

  it('should debounce search input (400ms)', async () => {
    fixture.detectChanges();
    appRef.tick();
    await appRef.whenStable();

    component.onSearch('advanced');
    
    await delay(450); 
    
    appRef.tick();
    await appRef.whenStable();

    expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, 'advanced', 'asc', 0, 3);
  });

  it('should handle pagination changes', async () => {
    fixture.detectChanges();
    appRef.tick();
    await appRef.whenStable();

    component.nextPage();
    
    appRef.tick();
    await appRef.whenStable();

    expect(component.pageIndex()).toBe(1);
    expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', 'asc', 1, 3);
  });

  it('should update sorting and reset page', async () => {
    fixture.detectChanges();
    component.pageIndex.set(5); 
    
    component.toggleSort();
    
    appRef.tick();
    await appRef.whenStable();

    expect(component.sortDirection()).toBe('desc');
    expect(component.pageIndex()).toBe(0);
  });

  it('should show the loading spinner while fetching', async () => {
    fixture.detectChanges();
    appRef.tick();

    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('.loading-spinner'));
    expect(spinner).toBeTruthy();
    expect(component.loading()).toBe(true);
  });
});