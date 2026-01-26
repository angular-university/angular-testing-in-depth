import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesDialog } from './courses-dialog';
import { CoursesService } from '../services/courses.service';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MOCK_COURSES } from '../testing/test-data';

describe('CoursesDialog', () => {
  let component: CoursesDialog;
  let fixture: ComponentFixture<CoursesDialog>;
  let mockCoursesService: any;
  let mockDialogRef: any;

  const mockCourse = MOCK_COURSES[0]

  beforeEach(async () => {
    mockCoursesService = {
      saveCourse: vi.fn().mockResolvedValue({})
    };
    mockDialogRef = { close: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [CoursesDialog],
      providers: [
        { provide: CoursesService, useValue: mockCoursesService },
        { provide: DialogRef, useValue: mockDialogRef },
        { provide: DIALOG_DATA, useValue: { course: mockCourse } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize the form with course data', () => {
    expect(component.courseForm.description().value()).toBe('Beginner Course');
    expect(component.courseForm().valid()).toBe(true);
  });

  it('should show validation error and disable save when description is cleared', async () => {
    component.courseForm.description().value.set('');
    component.courseForm.description().markAsTouched();
    
    fixture.detectChanges();

    const errorList = fixture.debugElement.query(By.css('.error-list'));
    expect(errorList).toBeTruthy();
    expect(errorList.nativeElement.textContent).toContain('Description is required');

    const saveBtn = fixture.debugElement.query(By.css('.btn-primary')).nativeElement;
    expect(saveBtn.disabled).toBe(true);
  });

  it('should call saveCourse and close dialog on valid submission', async () => {
    component.courseForm.description().value.set('New Course Title');
    fixture.detectChanges();

    const saveBtn = fixture.debugElement.query(By.css('.btn-primary'));
    saveBtn.nativeElement.click();

    await fixture.whenStable();

    expect(mockCoursesService.saveCourse).toHaveBeenCalledWith(1, expect.objectContaining({
      titles: expect.objectContaining({ description: 'New Course Title' })
    }));
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

it('should handle "Category is required" specifically', () => {
    component.courseForm.category().value.set('');
    component.courseForm.category().markAsTouched();
    
    fixture.detectChanges();

    const errors = fixture.debugElement.queryAll(By.css('.error-list li'));
    const categoryError = errors.find(el => 
      el.nativeElement.textContent.includes('Category is required')
    );
    
    expect(categoryError).toBeTruthy();
  });
});