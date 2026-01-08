import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CoursesDialog } from './courses-dialog';
import { of } from 'rxjs';
import { CoursesService } from '../../services/courses';

describe('CoursesDialog', () => {
  let component: CoursesDialog;
  let fixture: ComponentFixture<CoursesDialog>;
  let mockCoursesService: any;


  const mockCourse = {
    id: 1,
    titles: { description: 'Test Course', longDescription: 'Long Desc' },
    category: 'BEGINNER'
  };

  const dialogRefSpy = {
    close: vi.fn()
  };

  beforeEach(async () => {
    mockCoursesService = {
      saveCourse: vi.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [CoursesDialog, ReactiveFormsModule],
      providers: [
        { provide: CoursesService, useValue: mockCoursesService },
        { provide: 'DIALOG_DATA', useValue: { course: mockCourse } },
        { provide: 'DIALOG_REF', useValue: dialogRefSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should call saveCourse and close the dialog on success", async () => {
    const updatedValue = { ...mockCourse, titles: { description: 'Updated' } };
    mockCoursesService.saveCourse.mockReturnValue(of(updatedValue));

    component.form.patchValue({
      description: 'Updated',
      longDescription: 'Updated long desc'
    });

    component.save();

    expect(mockCoursesService.saveCourse).toHaveBeenCalledWith(mockCourse.id, expect.any(Object));
    expect(dialogRefSpy.close).toHaveBeenCalledWith(component.form.value);
  });
});