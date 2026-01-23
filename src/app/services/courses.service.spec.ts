import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from './courses.service';
import { Course } from '../model/course';
import { describe, beforeEach, it, expect, afterEach } from 'vitest';

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
    const changes: Partial<Course> = {
      titles: { description: 'New Title' }
    };
    const updatedCourse = { ...mockCourse, ...changes };

    (service as any).courses.set([mockCourse]);

    const savePromise = service.saveCourse(12, changes);

    const req = httpTestingController.expectOne('/api/courses/12');
    req.flush(updatedCourse);
    await savePromise;
    const allCourses = service.allCourses();
    expect(allCourses[0].titles.description).toBe('New Title');
  });
});