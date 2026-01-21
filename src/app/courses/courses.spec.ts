import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Courses } from './courses';
import { CoursesService } from '../services/courses';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Course } from '../model/course';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideRouter } from '@angular/router';

describe('Courses Component', () => {
  let component: Courses;
  let fixture: ComponentFixture<Courses>;
  let mockCoursesService: any;

  const mockCourses: Course[] = [
    { id: 1, category: 'BEGINNER', titles: { description: 'Beginner Course' } } as Course,
    { id: 2, category: 'ADVANCED', titles: { description: 'Advanced Course' } } as Course
  ];

  beforeEach(async () => {
    mockCoursesService = {
      allCourses: signal([]), 
      findAllCourses: vi.fn().mockResolvedValue(mockCourses)};
    await TestBed.configureTestingModule({
      imports: [Courses],
      providers: [
        { provide: CoursesService, useValue: mockCoursesService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Courses);
    component = fixture.componentInstance;
  });

  it('should load all courses on init and update the service signal', async () => {
    fixture.detectChanges(); 
    await fixture.whenStable();
    mockCoursesService.allCourses.set(mockCourses);
    
    fixture.detectChanges();

    expect(mockCoursesService.findAllCourses).toHaveBeenCalled();
    expect(component.beginnerCourses().length).toBe(1);
    expect(component.advancedCourses().length).toBe(1);
  });

  it('should switch tabs and display only advanced courses when clicked', () => {
    mockCoursesService.allCourses.set(mockCourses);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('.tab-link'));
    buttons[1].nativeElement.click();
    fixture.detectChanges();

    expect(component.activeTab()).toBe('advanced');

    const cardLists = fixture.debugElement.queryAll(By.css('courses-card-list'));
    expect(cardLists.length).toBe(1);
    expect(cardLists[0].componentInstance.courses()).toEqual(component.advancedCourses());
  });

  it('should show an empty message when no courses exist for a category', () => {
    mockCoursesService.allCourses.set([mockCourses[0]]);
    
    component.activeTab.set('advanced');
    fixture.detectChanges();

    const emptyMsg = fixture.debugElement.query(By.css('.empty-msg'));
    expect(emptyMsg.nativeElement.textContent).toContain('No advanced courses available');
  });
});