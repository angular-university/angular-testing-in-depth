import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseView } from './course-view';
import { CoursesService } from '../../services/courses';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { RouterTestingHarness } from '@angular/router/testing';

describe('CourseView', () => {
  let component: CourseView;
  let fixture: ComponentFixture<CourseView>;
  let coursesServiceMock: any;

  beforeEach(async () => {
    vi.useFakeTimers();

    coursesServiceMock = {
      findLessons: vi.fn().mockReturnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [CourseView],
      providers: [
        { provide: CoursesService, useValue: coursesServiceMock },
        provideRouter([
          {
            path: 'courses/:id',
            component: CourseView,
            resolve: {
              course: () =>
                of({
                  id: '1',
                  titles: {
                    description: 'Course Description'
                  }
                })
            }
          }
        ]), {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { course: { id: '1', titles: { description: 'Course Description' } } } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should trigger search after debounce', async () => {
    const searchString = 'Angular';

    component.onSearch(searchString);

    vi.advanceTimersByTime(400);

    fixture.detectChanges();

    await fixture.whenStable();

    expect(component.searchQuery()).toBe(searchString);
    expect(coursesServiceMock.findLessons).toHaveBeenCalledWith(
      '1',
      searchString,
      'asc',
      0,
      3
    );
  });

  it('should display Course ID from route parameters', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/courses/1', CourseView);
    expect(harness.routeNativeElement?.textContent).toContain('Course Description');
  });
});