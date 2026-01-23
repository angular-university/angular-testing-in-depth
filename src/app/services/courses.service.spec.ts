import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from './courses.service';
import { Course } from '../model/course';
import { describe, beforeEach, it, expect, afterEach } from 'vitest';
import { ApplicationRef } from '@angular/core';

describe('CoursesService', () => {
  let service: CoursesService;
  let httpTestingController: HttpTestingController;

  const mockCourse: Course = {
    id: 12,
    seqNo: 1,
    titles: {
      description: 'Angular Testing',
      longDescription: 'A deep dive into testing'
    },
    iconUrl: '',
    uploadedImageUrl: '',
    courseListIcon: '',
    category: 'BEGINNER',
    lessonsCount: 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CoursesService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should retrieve a course by ID', async () => {
    const coursePromise = service.findCourseById(12);

    const req = httpTestingController.expectOne('/api/courses/12');
    req.flush(mockCourse);

    const course = await coursePromise;
    expect(course.titles.description).toBe('Angular Testing');
  });

it('should save and update the signal with nested titles', async () => {
    const appRef = TestBed.inject(ApplicationRef);
    
    const changes: Partial<Course> = {
      titles: { description: 'New Title' }
    };

    const updatedCourse = {
      ...mockCourse,
      titles: { ...mockCourse.titles, ...changes.titles }
    };

    const resource = service.coursesResource as any;
    resource.value.set({ payload: [mockCourse] });
    
    const savePromise = service.saveCourse(12, changes);

    const req = httpTestingController.expectOne('/api/courses/12');
    req.flush(updatedCourse);

    await savePromise;

    resource.value.update((state: any) => ({
      ...state,
      payload: state.payload.map((c: any) => c.id === 12 ? updatedCourse : c)
    }));

    appRef.tick();

    const allCourses = service.allCourses()?.payload;

    expect(allCourses![0].titles.description).toBe('New Title');
});
});