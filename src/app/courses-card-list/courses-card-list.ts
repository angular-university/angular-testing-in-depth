import { Component, input, output, inject } from '@angular/core';
import { Course } from '../model/course';
import { Dialog } from '@angular/cdk/dialog';
import { CoursesDialog } from '../courses-dialog/courses-dialog';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'courses-card-list',
  standalone: true,
  templateUrl: './courses-card-list.html',
  styleUrl: './courses-card-list.scss',
  imports: [RouterLink],
})
export class CoursesCardList {
  courses = input.required<Course[]>();
  courseEdited = output();
  
  private dialog = inject(Dialog);

  editCourse(course: Course) {
    const dialogRef = this.dialog.open(CoursesDialog, {
      width: '500px',
      data: { course }
    });

    dialogRef.closed.subscribe(result => {
      if (result) {
        this.courseEdited.emit();
      }
    });
  }
}