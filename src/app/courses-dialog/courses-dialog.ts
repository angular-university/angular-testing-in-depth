import { Component, inject, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoursesService } from '../services/courses';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'courses-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './courses-dialog.html',
  styleUrl: './courses-dialog.scss',
})
export class CoursesDialog implements OnInit {
  private fb = inject(FormBuilder);
  private coursesService = inject(CoursesService);
  
  private dialogRef = inject(DialogRef<Course>); 
  public data = inject<{ course: Course }>(DIALOG_DATA);

  course: Course;
  form!: FormGroup;

  constructor() {
    this.course = this.data.course;
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

  async save() {
    if (this.form.invalid) return;

    const val = this.form.value;
    const changes: Partial<Course> = {
      category: val.category, 
      titles: {
        description: val.description,
        longDescription: val.longDescription
      }
    };

    try {
      await this.coursesService.saveCourse(this.course.id, changes);
      this.dialogRef.close(val);
    } catch (err) {
      console.error("Save failed", err);
    }
  }
}