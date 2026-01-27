import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from './courses.service';
import { Course } from '../model/course';
import { describe, beforeEach, it, expect, afterEach } from 'vitest';
import { createCourse, MOCK_COURSES } from '../testing/test-data';

describe('CoursesService', () => {
  let service: CoursesService;
  let httpTestingController: HttpTestingController;

  const mockCourse: Course = MOCK_COURSES[0];

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
    expect(req.request.method).toBe('GET')
    req.flush(mockCourse);

    const course = await coursePromise;
    expect(course.titles.description).toBe('Beginner Course');
  });

  it('should save and update the signal with nested titles', async () => {
    const initialCourse = createCourse({ id: 12, titles: { description: 'Old Title' } });
    const secondCourse = createCourse({ id: 1, titles: { description: 'Stay Same' } });

    const changes: Partial<Course> = {
      titles: { description: 'New Title' }
    };
    const updatedCourse = { ...initialCourse, ...changes };
    (service as any).courses.set([initialCourse, secondCourse]);

    const savePromise = service.saveCourse(12, changes);
    const req = httpTestingController.expectOne('/api/courses/12');
    req.flush(updatedCourse);
    await savePromise;

    const allCourses = service.allCourses();
    expect(allCourses[0].titles.description).toBe('New Title');
    expect(allCourses.find(c => c.id === 1)?.titles.description).toBe('Stay Same');
  });


  it('should find lessons with correct query parameters', async () => {
    const mockLessons = { payload: [{ id: 1, description: 'Lesson 1' }] };

    const promise = service.findLessons(12, 'filter-text', 'desc', 2, 10);

    const req = httpTestingController.expectOne(req => req.url === '/api/lessons');

    expect(req.request.params.get('courseId')).toBe('12');
    expect(req.request.params.get('filter')).toBe('filter-text');
    expect(req.request.params.get('sortOrder')).toBe('desc');
    expect(req.request.params.get('pageNumber')).toBe('2');
    expect(req.request.params.get('pageSize')).toBe('10');

    req.flush(mockLessons);

    const result = await promise;
    expect(result).toEqual(mockLessons.payload);
  });
  it('should retrieve courses, update signal, and return data (Success Path)', async () => {
    const mockPayload = { payload: MOCK_COURSES };

    const promise = service.findAllCourses();

    const req = httpTestingController.expectOne('/api/courses');
    expect(req.request.method).toBe('GET');
    req.flush(mockPayload);

    const result = await promise;

    expect(result).toEqual(MOCK_COURSES);
    expect(service.allCourses()).toEqual(MOCK_COURSES);
  });


});