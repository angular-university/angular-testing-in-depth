import { Component, Inject, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { CoursesService } from '../services/courses';

@Component({
  selector: 'app-courses-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './courses-dialog.html',
  styleUrl: './courses-dialog.scss',
})
export class CoursesDialog implements OnInit {
  course: Course;
  form: any;
  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService,
    @Inject('DIALOG_DATA') public data: { course: Course },
    @Inject('DIALOG_REF') private dialogRef: any
  ) {
    this.course = data.course;
  }

  ngOnInit() {
    this.form = this.fb.group({
      description: [this.course.titles.description, Validators.required],
      category: [this.course.category, Validators.required],
      releasedAt: [new Date(), Validators.required],
      longDescription: [this.course.titles.longDescription, Validators.required]
    });
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const val = this.form.value;
    const changes: Partial<Course> = {
      category: val.category, 
      titles: {
        description: val.description,
        longDescription: val.longDescription
      }
    };

    this.coursesService.saveCourse(this.course.id, changes)
      .pipe(
        tap(() => this.dialogRef.close(this.form.value))
      )
      .subscribe();
  }
}
