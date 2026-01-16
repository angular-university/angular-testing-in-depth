import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CoursesService } from './courses';
import { COURSES } from '../../../../server/db-data';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('CoursesService', () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CoursesService,
        provideHttpClient(), 
        provideHttpClientTesting(),
      ],
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should retrieve all courses and update the signal', () => {
    coursesService.findAllCourses().subscribe((courses) => {
      expect(courses).not.toBeNull();
      expect(courses.length).toBe(13);

      const course = courses.find((c) => c.id ===1);
      expect(course?.titles?.description).toBe('Angular Deep Dive Testing Course');
    });

    const req = httpTestingController.expectOne('/api/courses');
    expect(req.request.method).toBe('GET');
    req.flush({ payload: Object.values(COURSES) });

    expect(coursesService.allCourses().length).toBe(13);
  });
});