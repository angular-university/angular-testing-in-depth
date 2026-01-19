import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesCardList } from './courses-card-list';
import { setupCourses } from '../common/setup-test-data';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CoursesCardList', () => {
  let component: CoursesCardList;
  let fixture: ComponentFixture<CoursesCardList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesCardList], 
      providers: [
        provideRouter([]) 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesCardList);
    component = fixture.componentInstance;
    
    fixture.componentRef.setInput('courses', []);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the course list', () => {
    const mockCourses = setupCourses();
    fixture.componentRef.setInput('courses', mockCourses);

    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css(".course-card"));

    expect(cards).toBeTruthy();
    expect(cards.length).toBe(mockCourses.length);
  });

  it('should display the first course', () => {
    const mockCourses = setupCourses();
    fixture.componentRef.setInput('courses', mockCourses);
    
    fixture.detectChanges();

    const course = mockCourses[0];

    const card = fixture.debugElement.query(By.css(".course-card:first-child"));
    const title = card.query(By.css(".card-title")); 
    const image = card.query(By.css("img"));

    expect(card).toBeTruthy();
    expect(title.nativeElement.textContent).toContain(course.titles.description);
    expect(image.nativeElement.src).toContain(course.iconUrl);
  });
});