import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Courses } from './courses';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setupCourses } from '../common/setup-test-data';
import { signal } from '@angular/core';
import { CoursesService } from '../services/courses';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { click } from '../common/test-utils';
import { provideRouter } from '@angular/router';
import { Course } from '../model/course';
describe('Courses Component', () => {
  let fixture: ComponentFixture<Courses>;
  let component: Courses;
  let mockCoursesService: any;

  const beginnerCourses = setupCourses().filter((courses:Course) => courses.category === 'BEGINNER');
  const advancedCourses = setupCourses().filter((courses:Course) => courses.category === 'ADVANCED');
  const allCourses = setupCourses();

  beforeEach(async () => {
    mockCoursesService = {
      findAllCourses: vi.fn(),
      allCourses: signal([])
    };

    await TestBed.configureTestingModule({
      imports: [
        Courses
      ],
      providers: [
        { provide: CoursesService, useValue: mockCoursesService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Courses);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display both tabs when all courses are loaded", () => {
    mockCoursesService.findAllCourses.mockReturnValue(of(allCourses));
    mockCoursesService.allCourses.set(allCourses);

    fixture.detectChanges();

    const tabs = fixture.debugElement.queryAll(By.css(".tab-link"));
    expect(tabs.length).toBe(2);
  });


  it("should display only beginner courses", async () => {
    mockCoursesService.allCourses.set([]);
    mockCoursesService.findAllCourses.mockReturnValue(of(beginnerCourses));
    mockCoursesService.allCourses.set(beginnerCourses);

    fixture.detectChanges();

    await fixture.whenStable();

    fixture.detectChanges();

    const tabs = fixture.debugElement.queryAll(By.css(".tab-link"));
    expect(tabs.length).toBe(2);
    expect(tabs[0].nativeElement.textContent).toContain("Beginner");
    expect(tabs[1].nativeElement.textContent).toContain("Advanced");
  });

  it("should display advanced courses when tab clicked", async () => {
    mockCoursesService.findAllCourses.mockReturnValue(of(allCourses));
    mockCoursesService.allCourses.set(allCourses);

    fixture.detectChanges();

    const tabs = fixture.debugElement.queryAll(By.css(".tab-link"));

    tabs[1].triggerEventHandler('click', { button: 0 });

    fixture.detectChanges();

    await fixture.whenStable();

    fixture.detectChanges();

    const cardTitles = fixture.debugElement.queryAll(By.css('.card-title'));

    expect(cardTitles.length).toBeGreaterThan(0);
    expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");
  });

  it("should render correctly using async/await", async () => {
    mockCoursesService.findAllCourses.mockReturnValue(of(allCourses));
    mockCoursesService.allCourses.set(allCourses);

    fixture.detectChanges();

    const tabs = fixture.debugElement.queryAll(By.css(".tab-link"));
    click(tabs[1]);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const cardTitles = fixture.debugElement.queryAll(By.css('.card-title'));
    expect(cardTitles.length).toBeGreaterThan(0);
  });
});