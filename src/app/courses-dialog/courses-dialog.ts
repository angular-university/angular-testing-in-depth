import { Component, inject, signal } from '@angular/core';
import { Course, CourseData } from '../model/course';
import { CoursesService } from '../services/courses.service';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { form, required, submit,Field} from '@angular/forms/signals';

@Component({
  selector: 'courses-dialog',
  standalone: true,
  imports: [Field],
  templateUrl: './courses-dialog.html',
  styleUrl: './courses-dialog.scss',
})
export class CoursesDialog {
  private coursesService = inject(CoursesService);
  private dialogRef = inject(DialogRef<Course>); 
  public data = inject<{ course: Course }>(DIALOG_DATA);

  courseModel = signal<CourseData>({
    description: this.data.course.titles.description ?? '',
    category: this.data.course.category ?? '',
    releasedAt: new Date().toISOString().split('T')[0], 
    longDescription: this.data.course.titles.longDescription ?? ''
  });

  courseForm = form(this.courseModel, (f) => {
    required(f.description);
    required(f.category);
    required(f.releasedAt);
    required(f.longDescription);
  });

  close() {
    this.dialogRef.close();
  }

  async save() {
    await submit(this.courseForm, async (f) => {
      const val = f().value();
      
      const changes: Partial<Course> = {
        category: val.category as any, 
        titles: {
          description: val.description,
          longDescription: val.longDescription
        }
      };

      try {
        await this.coursesService.saveCourse(this.data.course.id, changes);
        this.dialogRef.close(val as any);
      } catch (err) {
        console.error("Save failed", err);
      }
    });
  }
}